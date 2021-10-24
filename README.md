# Botardo

![botardo](/docs/botardo.png)

Botardo es un slash command que te dice algunas de las infinitas cotizaciones del dolar en argentina.

Se usa de las siguientes 2 maneras:

```bash
/blue # para obtener Dolar Blue - Dolar oficial - Dolar "Solidario" - CCL - CCL Libre / BTC y ETH
```

```bash
/blue ripple # para obtener las cotizaciones informales y alguna crypto o token a eleccion en vez de las por defecto.
```

Instalalo en: https://slack.com/oauth/v2/authorize?client_id=3429355377.1999658509110&scope=commands&user_scope=

## FAQ

##

**Q:** Que cryptos puedo pasarle?

**A:** Las que soporta coingecko (https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list)

##

**Q:** De donde salen las cotizaciones informales?

**A:** De infobae.

##

**Q:** Puse /blue btc y no me trajo el bitcoin que le pasa a tu bot?

**A:** Tenes que pasarle el id de coingecko no el symbol del token.

##

**Q:** Que permisos necesita botardo?

**A:** El de agregar comandos nada mas.
