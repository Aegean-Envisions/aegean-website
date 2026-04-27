# Static site + selective basic auth for /weddings/
# Public: aegean-envisions.com (and all paths)
# Login-protected: aegean-envisions.com/weddings/
#
# Auth values are passed as build args from GitHub Actions secrets
# (WEDDING_USER, WEDDING_PASS). They never live in this repo or the
# image layers — htpasswd hashes them at build time.

FROM nginx:alpine
RUN apk add --no-cache apache2-utils

ARG WEDDING_USER=fos
ARG WEDDING_PASS=PleaseOverrideMe

RUN htpasswd -bBc /etc/nginx/.htpasswd-weddings "$WEDDING_USER" "$WEDDING_PASS" \
    && chmod 644 /etc/nginx/.htpasswd-weddings

# Copy site
COPY public-static/ /usr/share/nginx/html/

# Nginx config: public root, basic-auth on /weddings/
RUN printf '%s\n' \
    'server {' \
    '    listen 8080;' \
    '    server_name _;' \
    '    root /usr/share/nginx/html;' \
    '    index index.html index.htm;' \
    '' \
    '    location /weddings/ {' \
    '        auth_basic           "Aegean Envisions — Internal Preview";' \
    '        auth_basic_user_file /etc/nginx/.htpasswd-weddings;' \
    '        try_files $uri $uri/ /weddings/index.html;' \
    '    }' \
    '' \
    '    location / {' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '' \
    '    error_page 500 502 503 504 /50x.html;' \
    '    location = /50x.html { root /usr/share/nginx/html; }' \
    '}' \
    > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
