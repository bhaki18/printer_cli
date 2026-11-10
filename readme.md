# printer cli (`printez`)

CLI per eseguire operazioni rapide (scansione, stampa e fotocopia) con la stampante Brother MFC-7320.

## Come installarla
```bash
npm install
npm link
```

## Come usarla
```bash
# Mostra l'elenco dei comandi
printez --help

# Esegue una scansione (-p png, -j jpg, -f pdf)
printez scan -o nome_file -p

# Stampa un file o una stringa di testo (-n numero copie)
printez print -f documento.pdf -n 2
printez print -s "Testo da stampare"

# Esegue una fotocopia diretta dallo scanner
printez copy -n 1

# Mostra le informazioni sui job (-q in coda, -c completati, -n non completati)
printez show -q
printez show -c
printez show -n

# Cancella uno specifico job o l'intera coda
printez remove -j <id>
printez remove -a
```

## Come disinstallarla
```bash
npm unlink -g
# (opzionale) rimuove la cartella del progetto
rm printer_cli -r
```