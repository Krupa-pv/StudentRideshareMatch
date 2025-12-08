# Quick Start Guide

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: setup database using this 

```bash
mysql -u root -p < setup_database.sql
```

If you get "command not found", try the full path where your mysql is located like as follows:
```bash
/usr/local/mysql/bin/mysql -u root -p < setup_database.sql
```

Or add MySQL to PATH then run:

```bash
export PATH=$PATH:/usr/local/mysql/bin
mysql -u root -p < setup_database.sql
```

## Step 3: Configure Credentials

Edit `db_config.py` and update:
- `user='root'` --> your MySQL username
- `password='password'` --> your MySQL password

## Step 4: run program

```bash
python main.py
```


## Files
- db_config.py: sets up the necessary configurations to connect to the database
- db_operations.py: sets up the different operations that can be used by the CLI and web interface 
- main.py: CLI 
