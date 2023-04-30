import uuid
import mysql.connector
from django.conf import settings
from django.core.management import call_command

root_name = 'root'
secret_pass = 'root'

def create_root_acc():
    return mysql.connector.connect(host='localhost', user=root_name, password=secret_pass, auth_plugin='mysql_native_password')

def create_user_access(name:str):
    server = create_root_acc()
    localcursor = server.cursor()
    # try:
    #     localcursor.execute("CREATE USER '%s'@'localhost' IDENTIFIED BY '%s'" % (name, password))
    # except Exception as e:
    #     print(e)
    #     return 1
    
    
    # try:
    localcursor.execute("CREATE DATABASE simplefeed_%s" % name)
    # except Exception as e:
    #     localcursor = server.cursor()
    #     localcursor.execute("DROP USER '" + name + "'")
    #     print(e)
    # try:
    
    localcursor.execute("GRANT ALL PRIVILEGES ON simplefeed_%s.* TO 'python'@'localhost'" %(name))
    
    # except Exception as e:
    #     print(e)
    #     localcursor = server.cursor()
    #     localcursor.execute("DROP USER '" + name + "'")
    #     localcursor.execute("DROP DATABASE simplefeed_" + name)
    
    localcursor.execute("FLUSH PRIVILEGES")
    try:
        DB = create_dbconnect(name)
        call_command('migrate', 'simplefeed', database=DB)
    except Exception as e:
        print(e)
        localcursor = server.cursor()
        # localcursor.execute("DROP USER '%s'@'localhost'" %name)
        localcursor.execute("DROP DATABASE simplefeed_%s" %name)
        return 2
    
    # localcursor.execute("INSERT INTO products_rules (products_rules.name, products_rules.css_class, products_rules.action) VALUES ('Automaticke schvaleni', 'success', 'com_cat_s_1'), ('Automaticke zamitnuti', 'danger', 'com_cat_s_0'),('Schvalovat rucne', 'primary', 'com_cat_d_n'),('Pair to', 'warning', 'com_cat_p_t')")
    return 0
    
def create_dbconnect(DB_name)->str:
    new_database = {}
    new_database['ENGINE'] = 'django.db.backends.mysql'
    new_database['NAME'] = 'simplefeed_' + (DB_name if type(DB_name) == str else DB_name.user.username)
    new_database['USER'] = 'root'
    new_database['PASSWORD'] = 'root'
    new_database['HOST'] = 'localhost'
    new_database['TIME_ZONE'] = None
    new_database['CONN_HEALTH_CHECKS'] = False
    new_database['CONN_MAX_AGE'] = 0
    new_database['AUTOCOMMIT'] = True
    new_database['ATOMIC_REQUESTS'] = False
    new_database['OPTIONS'] = {}
    new_database['PORT'] = 3306
    database_id = str(uuid.uuid4())
    settings.DATABASES[database_id] = new_database
    return database_id
