#!/usr/bin/env node
import { execSync } from 'child_process';
import { program } from "commander";
import ora from 'ora';




const version = "1.3.0";

program
    .name("printez") //  nome del programma 
    .description("programma per eseguire semplici operazioni con la mia stampante brother mfc-7320.") // descrizione
    .version(version) // versione del programma

program // ora stabiliamo i comandi
    .command("scan") // come chiamare il comando per l'utente
    .description("esegue uno scan sulla stampante e restituisce un file in output") // descrizione del comando
    .option("-o, --output <fileName>", "sceglie la destinazione del file output, default = 'scansione.exemple' ", "scansione") // una flag del comando,poi ne puoi mettere di piu
    .option("-p, --png", "il file esce in formato pdf")
    .option("-j, --jpg", "il file esce in formato jpg")
    .option("-f, --pdf", "il file esce in formato pdf")
    .action((options) => {
        let format = "png";
        let dest;
        if (options.jpg) { format = "jpg" };
        if (options.pdf) { format = "pdf" };
        if (!options.output) {
            dest = "scansione." + format;
        } else {
            dest = options.output + "." + format;
        }
        if (format == "jpg") { format = "jpeg" }

        let command_to_exe = "newgrp lp && scanimage -L && scanimage --source FlatBed --resolution 300 --format=" + format + " -o " + dest;

        console.log("formato messo:" + format);
        console.log("dest messa:" + dest);
        console.log("comando eseguito:\n" + command_to_exe);

        console.log("Eseguzione del comando in corso...");

        const output = execSync(command_to_exe);
    })

program
    .command("print")
    .description("stampa un file o una stringa di testo")
    .option("-s , --string <strings...>", " stampa una stringa di testo")
    .option("-f, --file <filePath>", "stampa un file")
    .option("-n, --numberCopy <Interger>", "stampa tante copie quante il numero messo (n>0)")
    .action((options) => {
        try {
            let string;
            let numero_di_copie = 1;
            let file;
            let command_to_exe;

            if (options.numberCopy) {
                numero_di_copie = parseInt(options.numberCopy);
            }

            if (!Number.isInteger(numero_di_copie) || numero_di_copie < 1) {
                throw new Error("il numero di copie deve essere intero e > di 0")
            }

            if (options.string && options.file) {
                throw new Error("Conflitto tra flags! non puoi passare sia una stringa che un file!");
            } else if (!options.string && !options.file) {
                throw new Error("non hai inserito nè una striga ne un file,che cosa dovrebbe stampare la stampante!?");
            } else if (options.file) {
                command_to_exe = "lp " + options.file;

                console.log("comando eseguito:\n" + command_to_exe);
                console.log("Eseguzione del comando in corso...");

            } else if (options.string) {
                command_to_exe = "printf " + "\"" + options.string + "\"" + "| lp -d stampante-bw -n " + numero_di_copie;

                console.log("comando eseguito:\n" + command_to_exe);
                console.log("Eseguzione del comando in corso...");

            }



            for (let i = 0; i < numero_di_copie; i++) {
                execSync(command_to_exe);
            }


        } catch (error) {
            console.log("FATAL ERROR:" + error);
        }

    })

program
    .command("copy")
    .description("fotocopia un documento inserito nello scanner della stampante e salva il file")
    .option("-n --numberCopy <Number>", "il numero di fotocopie da fare")
    .action(async (options) => {
        try {

            const spinner = ora("avvio operazione in corso...").start();

            let command_to_exe_1; // scannerizza il documento e lo salva in un file temporaneo
            let command_to_exe_2; // stampa il documento scannerizzato 


            let number_of_copy;
            let fileName = "tmp_fotocopia_tmp";
            let filePath = fileName + ".png";

            if (options.numberCopy) {
                number_of_copy = options.numberCopy;
                command_to_exe_2 = "startez print -f " + filePath + " -n " + number_of_copy;
            } else {
                command_to_exe_2 = "startez print -f " + filePath
            }

            command_to_exe_1 = "startez scan -o " + fileName + " -p";

            let command_to_exe = command_to_exe_1 + " && " + command_to_exe_2 + " && rm " + filePath;

            spinner.text = "scan in corso..."
            execSync(command_to_exe);
            spinner.succeed("Stampa avviata con successo!")




        } catch (err) {
            console.log("FATAL ERROR: " + err);
        }
    })


program.parse();