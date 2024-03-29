# Nginx

[INICIO](../README.md)

> **Atencao:** desconsiderar o uso de acentos

> **Documentacao:** [digitalocean.com...](https://www.digitalocean.com/community/tutorials/how-to-increase-pagespeed-score-by-changing-your-nginx-configuration-on-ubuntu-16-04)

## [INSTALACAO]

```bash
# Vai para raiz
$ cd ~/

# Lista as assinaturas
$ apt-key list

# Adiciona a assinatura key do nginx oficial
$ curl -O https://nginx.org/keys/nginx_signing.key && apt-key add ./nginx_signing.key

# Adiciona os repositórios da versao estavel do nginx
$ nano /etc/apt/sources.list

# Adiciona os repositorios:
deb http://nginx.org/packages/ubuntu/ xenial nginx
deb-src http://nginx.org/packages/ubuntu/ xenial nginx

# Baixa os pacotes novos
$ apt-get update

# Instala o NGINX
$ apt-get install nginx
```

## [COMANDOS]

```bash
# Visualizar a versao do nginx
$ nginx -v

# Configuracoes ok?
$ nginx -t

# Status
$ service nginx status

# Inicializa
$ service nginx start

# Reinicia
$ service nginx restart

# Inicializa
$ service nginx stop
```

## [CONFIGURACOES]

### CONFIGURACOES / nginx.conf

```bash
# Edita o arquivo nginx.conf
$ nano /etc/nginx/nginx.conf

        # ALTERA
        user www-data;
        worker_processes 1;
```

### CONFIGURACOES / snippets (PASTA)

```bash
# Cria a pasta snippets e acessa
$ mkdir /etc/nginx/snippets && cd /etc/nginx/snippets && ls -la
```

### CONFIGURACOES / port.conf

```bash
$ nano /etc/nginx/snippets/port.conf

        # INSERE
        listen 127.0.0.1:8080;
```

### CONFIGURACOES / gzip.conf

```bash
$ nano /etc/nginx/snippets/gzip.conf

        # INSERE
        gzip on;
        gzip_comp_level 5;
        gzip_min_length 256;
        gzip_proxied any;
        gzip_vary on;
```

### CONFIGURACOES / cfg.conf

```bash
$ nano /etc/nginx/snippets/cfg.conf

        # INSERE
        location / {
                index index.php index.html index.htm;
                try_files $uri $uri/ /index.php?\$args;
        }

        location /nginx_status {
                #stub_status on;
                #server_tokens off;
                access_log off;
                allow 127.0.0.1;
                deny all;
        }

        location ~ /\.git {
                deny all;
        }

        location ~ /.well-known {
                allow all;
        }

        location ~ \.php\$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/run/php/php7.2-fpm.sock;
        }

        location ~ /\.ht {
                deny all;
        }

        gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.geo+json
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/bmp
        image/svg+xml
        image/x-icon
        text/cache-manifest
        text/css
        text/plain
        text/vcard
        text/vnd.rim.location.xloc
        text/vtt
        text/x-component
        text/x-cross-domain-policy;

        location ~\* \.(jpg|jpeg|png|gif|ico|css|js|pdf)\$ {
                expires 7d;
        }
```

### CONFIGURACOES / fastcgi-php.conf

```bash
$ nano /etc/nginx/snippets/fastcgi-php.conf

        # INSERE
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        try_files $fastcgi_script_name = 404;
        set $path_info $fastcgi_path_info;
        fastcgi_param PATH_INFO $path_info;
        fastcgi_index index.php;
        include fastcgi.conf;
```

### CONFIGURACOES / fastcgi.conf

```bash
$ nano /etc/nginx/fastcgi.conf

        # INSERE
	fastcgi_param SCRIPT_FILENAME           $document_root$fastcgi_script_name;
	fastcgi_param QUERY_STRING              $query_string;
	fastcgi_param REQUEST_METHOD            $request_method;
	fastcgi_param CONTENT_TYPE              $content_type;
	fastcgi_param CONTENT_LENGTH            $content_length;

	fastcgi_param SCRIPT_NAME               $fastcgi_script_name;
	fastcgi_param REQUEST_URI               $request_uri;
	fastcgi_param DOCUMENT_URI              $document_uri;
	fastcgi_param DOCUMENT_ROOT             $document_root;
	fastcgi_param SERVER_PROTOCOL           $server_protocol;
	fastcgi_param REQUEST_SCHEME            $scheme;
	fastcgi_param HTTPS                     $https if_not_empty;

	fastcgi_param GATEWAY_INTERFACE         CGI/1.1;
	fastcgi_param SERVER_SOFTWARE           nginx/$nginx_version;

	fastcgi_param REMOTE_ADDR               $remote_addr;
	fastcgi_param REMOTE_PORT               $remote_port;
	fastcgi_param SERVER_ADDR               $server_addr;
	fastcgi_param SERVER_PORT               $server_port;
	fastcgi_param SERVER_NAME               $server_name;

	fastcgi_param REDIRECT_STATUS           200;
```

## [VIRTUAL HOST]

### VIRTUAL HOST / default.conf

```bash
# Edita ou cria
$ nano /etc/nginx/sites-available/default.conf

        # INSERE
        server
        {
                #include snippets/port.conf;
                include snippets/gzip.conf;
                listen 80 default_server;
                server_name default.local;
                root /var/www/default/html;

                access_log /var/www/default/logs/default-access.log;
                error_log /var/www/default/logs/default-error.log;

                include snippets/cfg.conf;
        }

# Cria link simbolico
$ cd /etc/nginx/sites-enabled && ln -s ../sites-available/default.conf
```

### VIRTUAL HOST / phpmyadmin.conf

```bash
# Edita ou cria
$ nano /etc/nginx/sites-available/phpmyadmin.conf

        # INSERE
        server_name phpmyadmin.<url_site>;

        location / {
                proxy_pass http://localhost:8080;
        }

# Cria link simbolico
$ cd /etc/nginx/sites-enabled && ln -s ../sites-available/phpmyadmin.conf
```

### VIRTUAL HOST / api.conf

```bash
# Edita ou cria
$ nano /etc/nginx/sites-available/api.conf

        # INSERE
        server {
                server_name api.venzel.com.br;
                listen 127.0.0.1:8080;

                location /nginx_status {
                        #stub_status on;
                        #server_tokens off;
                        access_log off;
                        allow 127.0.0.1;
                        deny all;
                }


                location / {
                        proxy_pass http://127.0.0.1:3333;
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection 'upgrade';
                        proxy_set_header Host $host;
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forwarded-Proto $scheme;
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        proxy_cache_bypass $http_upgrade;
                }
        }

# Cria link simbolico
$ cd /etc/nginx/sites-enabled && ln -s ../sites-available/api.conf
```

### VIRTUAL HOST / <nome_projeto>.conf

```bash
# Edita ou cria
$ nano /etc/nginx/sites-available/<nome>.conf

        # INSERE
        server
        {
                include snippets/port.conf;
                include snippets/gzip.conf;

                server_name <nome>.com.br www.<nome>.com.br;
                root /var/www/<nome>/html;

                access_log /var/www/<nome>/logs/<nome>-access.log;
                error_log /var/www/<nome>/logs/<nome>-error.log;

                include snippets/cfg.conf;
        }

$ cd /etc/nginx/sites-enabled && ln -s ../sites-available/<nome>.conf
```

## [DESINSTALACAO]

```bash
# Remove o nginx e e mantém as configuracoes
$ apt-get remove nginx nginx-common

# Remove o nginx e todas as configuracoes
$ apt-get purge nginx nginx-common

# Apos remover o nginx executa o comando para limpar tudo
$ apt-get autoremove
```
