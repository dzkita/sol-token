# hyper_token
Este es el repo donde vamos a experimentar con las herramientas de Solana. 

```bash
    git add .
    git commit -m <"msg_de_commit">
    git push origin 
```

# Features :
1. Es un token estilo wrapped (ej wSOL), el cual se paga con $SOL y se mintea el otro
2. Tiene la capacidad de hacer transferencias discritas (tiene un fee de 100 lamports)
3. Tiene integrado un feed el cual e usa para calcular el precio del token (seguramente se tenga que poner los del interes-bearing token)
4. Toda la moneda que se pone en el protocolo, se delega y se pone a laburar
5. Un minteo de cuentas para las recompensas (estan bloquedas en el tiempo, pero se pueden transferir por menos cantidad de moneda, capaz tienen asociado un `cNFT`)
