"""
Placeholder para integración con WhatsApp (Twilio) y Telegram.

Cuando estés listo para activar:
1. WhatsApp vía Twilio:
   - pip install twilio
   - Configura TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM en .env
   - El webhook de Twilio apunta a POST /api/messaging/whatsapp/webhook

2. Telegram Bot:
   - pip install python-telegram-bot
   - Configura TELEGRAM_BOT_TOKEN en .env
   - Registra el webhook: POST https://api.telegram.org/bot<TOKEN>/setWebhook?url=<TU_URL>/api/messaging/telegram/webhook

El bot pregunta:
  1. ¿En qué municipio vives? (región)
  2. ¿Eres gestante, lactante, o cuidas a un niño menor de 2 años?
  3. ¿Cuántas comidas al día consumes/da?
  4. ¿Crees que tienes suficientes alimentos esta semana? (inseguridad alimentaria)
  5. ¿Qué alimentos típicos consumes en tu región? (mapeo comunitario)
"""

import os
import json
import logging
from typing import Optional
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from pydantic import BaseModel

logger = logging.getLogger("messaging")
router = APIRouter(prefix="/api/messaging", tags=["messaging"])

# ─── Flujo conversacional del bot ────────────────────────────────────────────

BOT_FLOW = {
    "start": {
        "question": "¡Hola! Soy el bot del Observatorio de Alimentación 🌿\n¿Eres gestante, madre lactante, o cuidas a un niño menor de 2 años?\n\nResponde: *gestante*, *lactante*, *cuido a un niño*, u *otro*.",
        "key": "population",
        "next": "region",
    },
    "region": {
        "question": "¿En qué municipio o región vives? (Ej: Valledupar, Santa Marta, Ciénaga...)",
        "key": "region",
        "next": "meals",
    },
    "meals": {
        "question": "¿Cuántas veces al día comes habitualmente? (1, 2 o 3 veces)",
        "key": "eats_3_meals",
        "transform": lambda v: int(v.strip()) >= 3 if v.strip().isdigit() else None,
        "next": "protein",
    },
    "protein": {
        "question": "¿Comiste carne, pescado, huevo o leguminosas (fríjol, guandú) ayer?\n\nResponde: *sí* o *no*",
        "key": "has_protein",
        "transform": lambda v: v.strip().lower() in ["sí", "si", "yes", "s"],
        "next": "insecurity",
    },
    "insecurity": {
        "question": "En los últimos 7 días, ¿hubo algún día en que no tuviste suficiente comida para ti o tu familia?\n\nResponde: *sí* o *no*",
        "key": "food_insecurity",
        "transform": lambda v: v.strip().lower() in ["sí", "si", "yes", "s"],
        "next": "food_mapping",
    },
    "food_mapping": {
        "question": "¿Qué alimento típico de tu región consumes con frecuencia que no sea muy conocido? (Opcional, escribe el nombre o di *omitir*)",
        "key": "local_food",
        "next": "done",
    },
    "done": {
        "question": "¡Gracias por tu reporte! 🙏 Tu información ayuda a mejorar la seguridad alimentaria en tu región. ¡Hasta pronto!",
        "key": None,
        "next": None,
    },
}


class ConversationState(BaseModel):
    """Estado en memoria de la conversación (en producción usar Redis)."""
    step:    str = "start"
    data:    dict = {}
    channel: str = "whatsapp"


# Estado en memoria (simple, para desarrollo)
_sessions: dict[str, ConversationState] = {}


def _process_step(session_id: str, user_message: str, channel: str = "whatsapp") -> str:
    """Avanza el flujo conversacional y devuelve la siguiente pregunta."""
    state = _sessions.get(session_id, ConversationState(channel=channel))
    current = BOT_FLOW.get(state.step)

    if not current:
        state.step = "start"
        _sessions[session_id] = state
        current = BOT_FLOW["start"]
        return current["question"]

    # Guardar respuesta del paso actual
    if current["key"]:
        transform = current.get("transform")
        value = transform(user_message) if transform else user_message.strip()
        state.data[current["key"]] = value

    # Avanzar al siguiente paso
    next_step = current["next"] or "done"
    state.step = next_step
    _sessions[session_id] = state

    next_flow = BOT_FLOW.get(next_step, BOT_FLOW["done"])
    response  = next_flow["question"]

    # Si llegamos al final, guardar en BD (async)
    if next_step == "done":
        _save_report(state.data, channel)
        del _sessions[session_id]

    return response


def _save_report(data: dict, channel: str):
    """Guarda el reporte de nutrición en la base de datos."""
    try:
        from database import engine
        from models import NutritionReport
        from sqlmodel import Session
        with Session(engine) as session:
            report = NutritionReport(
                channel=channel,
                region=data.get("region", ""),
                population=data.get("population", "general"),
                eats_3_meals=data.get("eats_3_meals"),
                has_protein=data.get("has_protein"),
                food_insecurity=data.get("food_insecurity"),
                notes=data.get("local_food"),
            )
            session.add(report)
            session.commit()
    except Exception as e:
        logger.error("Error guardando reporte: %s", e)


# ─── WhatsApp Webhook (Twilio) ────────────────────────────────────────────────

@router.post("/whatsapp/webhook")
async def whatsapp_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Webhook de Twilio para WhatsApp.
    Twilio envía form-data con 'From' y 'Body'.

    Para activar:
    1. pip install twilio
    2. Configurar en .env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
    3. En consola Twilio → Sandbox for WhatsApp → webhook URL = https://<tu-dominio>/api/messaging/whatsapp/webhook
    """
    form = await request.form()
    sender  = str(form.get("From", ""))
    message = str(form.get("Body", ""))

    if not sender or not message:
        raise HTTPException(400, "Payload incompleto")

    response_text = _process_step(sender, message, channel="whatsapp")

    # Respuesta en formato TwiML (XML)
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{response_text}</Message>
</Response>"""
    from fastapi.responses import Response
    return Response(content=twiml, media_type="application/xml")


# ─── Telegram Webhook ────────────────────────────────────────────────────────

@router.post("/telegram/webhook")
async def telegram_webhook(request: Request):
    """
    Webhook de Telegram Bot.

    Para activar:
    1. pip install python-telegram-bot
    2. Crear bot con @BotFather y obtener token
    3. Configurar en .env: TELEGRAM_BOT_TOKEN
    4. Registrar webhook:
       curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" -d "url=https://<tu-dominio>/api/messaging/telegram/webhook"
    """
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(400, "JSON inválido")

    message = data.get("message", {})
    chat_id = str(message.get("chat", {}).get("id", ""))
    text    = message.get("text", "")

    if not chat_id or not text:
        return {"ok": True}

    response_text = _process_step(chat_id, text, channel="telegram")

    # Enviar respuesta al usuario via Telegram API
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if token:
        import httpx
        async with httpx.AsyncClient() as client:
            await client.post(
                f"https://api.telegram.org/bot{token}/sendMessage",
                json={"chat_id": chat_id, "text": response_text, "parse_mode": "Markdown"},
            )

    return {"ok": True}


# ─── Endpoint de prueba del bot ───────────────────────────────────────────────

@router.post("/test")
def test_bot(session_id: str, message: str, channel: str = "web"):
    """Endpoint para probar el flujo del bot sin WhatsApp/Telegram."""
    response = _process_step(session_id, message, channel)
    return {"response": response, "session_id": session_id}


@router.get("/test/start")
def start_bot_session(session_id: str):
    """Inicia una sesión del bot desde cero."""
    if session_id in _sessions:
        del _sessions[session_id]
    first_question = BOT_FLOW["start"]["question"]
    return {"response": first_question, "session_id": session_id}
