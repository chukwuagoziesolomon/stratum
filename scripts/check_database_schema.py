import os
from pathlib import Path

try:
    from psycopg2 import connect
    from psycopg2.extras import RealDictCursor
except ImportError as exc:
    raise SystemExit("psycopg2 is required to run this script. Install it with `pip install psycopg2-binary`.\n") from exc


def load_env(env_path: Path) -> None:
    if not env_path.exists():
        raise FileNotFoundError(f"Environment file not found: {env_path}")

    with env_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"')
            os.environ.setdefault(key, value)


def query_columns(table_name: str) -> None:
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise SystemExit("DATABASE_URL is not set in the environment.")

    with connect(database_url) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT column_name, data_type, is_nullable, column_default "
                "FROM information_schema.columns "
                "WHERE table_name = %s "
                "ORDER BY ordinal_position;",
                (table_name,),
            )
            rows = cursor.fetchall()

    if not rows:
        print(f"No columns found for table '{table_name}'.")
        return

    print(f"Schema for table '{table_name}':")
    print("-" * 60)
    for row in rows:
        print(
            f"{row['column_name']:30} {row['data_type']:20} "
            f"nullable={row['is_nullable']:5} default={row['column_default']}"
        )


if __name__ == "__main__":
    env_file = Path(__file__).resolve().parent.parent / ".env.local"
    load_env(env_file)

    print("Loaded environment from", env_file)
    print()

    import sys
    table_names = sys.argv[1:] or ["transactions"]
    for table_name in table_names:
        query_columns(table_name)
        print()
