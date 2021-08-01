import fs from 'fs';
import shell from 'shelljs';

export default class OttFileController {
    constructor() {
        this.currentDir = process.cwd();
    }

    createDirectory(dir) {
        if (!fs.existsSync(dir)) {
            shell.mkdir('-p', dir);

            return true;
        }

        return false;
    }

    createDirectories(dirs) {
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                shell.mkdir('-p', dir);
            }
        });
    }

    directoryExists(dir) {
        return fs.existsSync(dir);
    }

    createFile(destination, templatePath = false, replacements = false,) {
        let template;

        if (templatePath) {
            template = fs.readFileSync(templatePath, "utf8");

            if (replacements) {
                replacements.forEach(replacement => {
                    template = template.split(replacement[0]).join(replacement[1]);
                });
            }
        } else {
            template = '';
        }

        fs.writeFileSync(destination, template);
    }

    createImage(destination, template) {
        fs.readFile(template, (err, data) => {
            if (err) throw err;

            fs.writeFile(destination, data, 'base64', (err) => {
                if (err) throw err;
            });
        });
    }
}
