import sqlite3
import os

db_path = "/root/bipingaire/tech-craft/backend/data/sql_app.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(candidates);")
        columns = [column[1] for column in cursor.fetchall()]
        if 'skills' not in columns:
            cursor.execute("ALTER TABLE candidates ADD COLUMN skills TEXT;")
            conn.commit()
            print("Column 'skills' added successfully")
        else:
            print("Column 'skills' already exists")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
else:
    print(f"Database not found at {db_path}")
