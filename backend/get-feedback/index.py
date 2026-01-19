import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """Получение списка сообщений обратной связи из БД"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        database_url = os.environ.get('DATABASE_URL')
        
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Database configuration missing'})
            }
        
        params = event.get('queryStringParameters') or {}
        status = params.get('status')
        limit = int(params.get('limit', 50))
        offset = int(params.get('offset', 0))
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if status:
            cur.execute(
                """SELECT id, name, email, category, message, created_at, status, telegram_sent, notes
                   FROM feedback_messages 
                   WHERE status = %s
                   ORDER BY created_at DESC 
                   LIMIT %s OFFSET %s""",
                (status, limit, offset)
            )
        else:
            cur.execute(
                """SELECT id, name, email, category, message, created_at, status, telegram_sent, notes
                   FROM feedback_messages 
                   ORDER BY created_at DESC 
                   LIMIT %s OFFSET %s""",
                (limit, offset)
            )
        
        messages = cur.fetchall()
        
        cur.execute("SELECT COUNT(*) as total FROM feedback_messages" + (" WHERE status = %s" if status else ""), 
                   (status,) if status else ())
        total = cur.fetchone()['total']
        
        cur.close()
        conn.close()
        
        for msg in messages:
            if msg['created_at']:
                msg['created_at'] = msg['created_at'].isoformat()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'messages': messages,
                'total': total,
                'limit': limit,
                'offset': offset
            }, ensure_ascii=False)
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
