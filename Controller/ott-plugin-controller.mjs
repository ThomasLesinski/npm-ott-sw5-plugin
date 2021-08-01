import OttFileController from "./ott-file-controller.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default class OttPluginController {
    #fileController;
    #__dirname;
    #templatesFolderPath;
    #pluginFolderPath;
    #pluginName;

    constructor() {
        this.#fileController = new OttFileController();
        this.#__dirname = dirname(fileURLToPath(import.meta.url));
        this.#pluginFolderPath = './PluginName';
        this.#templatesFolderPath = `${this.#__dirname}/../Templates`;
    }

    setPluginName(pluginName) {
        this.#pluginName = pluginName;
        this.#pluginFolderPath = `./${pluginName}`;
    }

    createPlugin() {
        this.determinePluginFolderPath();

        if (this.#fileController.directoryExists(this.#pluginFolderPath)) {
            console.log(`\nError: Plugin with name ${this.#pluginName} exists already.\n`);

            return;
        }

        this.#fileController.createDirectories([
            this.#pluginFolderPath,
            `${this.#pluginFolderPath}/Subscriber`,
            `${this.#pluginFolderPath}/Resources/frontend`,
            `${this.#pluginFolderPath}/Resources/frontend/js`,
            `${this.#pluginFolderPath}/Resources/frontend/less`,
            `${this.#pluginFolderPath}/Resources/Views/frontend/frontend_controller`,
            `${this.#pluginFolderPath}/Bootstrap`,
            `${this.#pluginFolderPath}/Controller/Frontend`
        ]);

        this.#fileController.createImage(
            `${this.#pluginFolderPath}/plugin.png`,
            `${this.#templatesFolderPath}/plugin.png`,
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/plugin.xml`,
            `${this.#templatesFolderPath}/plugin.xml.template`,
            [
                ['%pluginName%', this.#pluginName],
            ]
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/${this.#pluginName}.php`,
            `${this.#templatesFolderPath}/Bootstrap.php.template`,
            [
                ['%pluginName%', this.#pluginName],
            ]
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Subscriber/ControllerSubscriber.php`,
            `${this.#templatesFolderPath}/ControllerSubscriber.php.template`,
            [
                ['%pluginName%', this.#pluginName],
            ]
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Resources/services.xml`,
            `${this.#templatesFolderPath}/services.xml.template`,
            [
                ['%pluginName%', this.#pluginName],
                ['%pluginNameLowercase%', this.#pluginName.toLowerCase()],
            ]
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Resources/config.xml`,
            `${this.#templatesFolderPath}/config.xml.template`,
            [
                ['%pluginName%', this.#pluginName],
            ]
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Resources/config.xml`,
            `${this.#templatesFolderPath}/cronjob.xml.template`,
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Resources/frontend/js/main.js`,
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Resources/frontend/less/all.less`,
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Resources/Views/frontend/frontend_controller/index.tpl`,
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Bootstrap/AttributeBuilder.php`,
            `${this.#templatesFolderPath}/AttributeBuilder.php.template`,
            [
                ['%pluginName%', this.#pluginName],
            ],
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Bootstrap/AttributeBuilder.php`,
            `${this.#templatesFolderPath}/AttributeBuilder.php.template`,
            [
                ['%pluginName%', this.#pluginName],
            ],
        );

        this.#fileController.createFile(
            `${this.#pluginFolderPath}/Controller/Frontend/FrontendController.php`,
            `${this.#templatesFolderPath}/FrontendController.php.template`,
        );
    }

    determinePluginFolderPath() {
        const dirCustomExists = this.#fileController.directoryExists('./custom/plugins');

        if (dirCustomExists) {
            this.#pluginFolderPath = `./custom/plugins/${this.#pluginName}`;
        }
    }
}
