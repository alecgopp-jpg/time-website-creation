import json
import os
import urllib.request
import urllib.parse
from datetime import datetime
import psycopg2

def handler(event: dict, context) -> dict:
    """Отправка сообщений обратной связи в Telegram бот и сохранение в БД"""
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        name = body.get('name', 'Аноним')
        email = body.get('email', 'не указан')
        category = body.get('category', 'other')
        message = body.get('message', '')
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Message is required'})
            }
        
        database_url = os.environ.get('DATABASE_URL')
        conn = None
        telegram_sent = False
        feedback_id = None
        
        try:
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            cur.execute(
                "INSERT INTO feedback_messages (name, email, category, message, telegram_sent) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (name, email, category, message, False)
            )
            feedback_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
        except Exception as db_error:
            if conn:
                conn.rollback()
            pass
        
        category_labels = {
            'feedback': '💬 Отзыв / Комментарий',
            'research': '📚 Исследование',
            'media': '📰 СМИ',
            'other': '📝 Другое'
        }
        category_label = category_labels.get(category, '📝 Другое')
        
        telegram_message = f"""🔔 <b>Новое сообщение с сайта</b>

{category_label}

<b>Имя:</b> {name}
<b>Email:</b> {email}
<b>Время:</b> {datetime.now().strftime('%d.%m.%Y %H:%M')}

<b>Сообщение:</b>
{message}"""
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        if not bot_token or not chat_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Telegram configuration missing'})
            }
        
        url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
        data = urllib.parse.urlencode({
            'chat_id': chat_id,
            'text': telegram_message,
            'parse_mode': 'HTML'
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method='POST')
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            telegram_sent = result.get('ok', False)
        
        if conn and feedback_id:
            try:
                cur = conn.cursor()
                cur.execute(
                    "UPDATE feedback_messages SET telegram_sent = %s WHERE id = %s",
                    (telegram_sent, feedback_id)
                )
                conn.commit()
                cur.close()
            except Exception:
                pass
        
        if conn:
            conn.close()
        
        if telegram_sent:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Message sent successfully', 'id': feedback_id})
            }
        else:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'message': 'Message saved but Telegram sending failed', 'id': feedback_id, 'telegram_sent': False})
            }
    
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }