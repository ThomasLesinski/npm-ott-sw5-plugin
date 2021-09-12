import FileController from "./file.controller.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default class PluginController {
    #fileController;
    #__dirname;
    #templatesFolderPath;
    #pluginFolderPath;
    #pluginName;
    #presets;

    constructor() {
        this.fileController = new FileController();
        this.__dirname = dirname(fileURLToPath(import.meta.url));
        this.pluginFolderPath = './PluginName';
        this.templatesFolderPath = `${this.__dirname}/../Templates`;
    }
    
    get fileController() {
        return this.#fileController;
    }
    
    set fileController(fileController) {
        this.#fileController = fileController;
    }

    get __dirname() {
        return this.#__dirname;
    }

    set __dirname(dirname) {
        this.#__dirname = dirname;
    }
    
    get pluginFolderPath() {
        return this.#pluginFolderPath;
    }
    
    set pluginFolderPath(pluginFolderPath) {
        this.#pluginFolderPath = pluginFolderPath;
    }

    get templatesFolderPath() {
        return this.#templatesFolderPath;
    }

    set templatesFolderPath(templatesFolderPath) {
        this.#templatesFolderPath = templatesFolderPath;
    }

    get pluginName() {
        return this.#pluginName;
    }

    set pluginName(pluginName) {
        this.#pluginName = pluginName;
        this.pluginFolderPath = `./${pluginName}`;
    }

    get pluginNameNoPrefix() {
        return this.pluginName.replace('Ott', '');
    }

    get pluginNameLowercaseNoPrefix() {
        return this.pluginNameNoPrefix.toLowerCase();
    }

    get pluginNameKebabCaseLowercaseNoPrefix() {
        return this.pluginNameNoPrefix.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }

    get pluginNameSnakeCaseLowercaseNoPrefix() {
        return this.pluginNameNoPrefix.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toLowerCase();
    }

    get presets() {
        return this.#presets;
    }

    set presets(presets) {
        this.#presets = presets;
    }

    createPlugin() {
        this.determinePluginFolderPath();

        if (this.fileController.directoryExists(this.pluginFolderPath)) {
            console.error(`\nError: Plugin with name ${this.pluginName} exists already.\n`);

            return;
        }

        const directoriesToCreate = [
            this.pluginFolderPath,
            `${this.pluginFolderPath}/Resources/frontend`,
            `${this.pluginFolderPath}/Resources/frontend/js`,
            `${this.pluginFolderPath}/Resources/frontend/less`,
        ];

        let presetAttributeBuilder = this.presets.includes('preset-attribute-builder');
        let presetCronjob = this.presets.includes('preset-cronjob');
        let presetEmotioninstaller = this.presets.includes('preset-emotioninstaller');
        let presetControllersubscriber = this.presets.includes('preset-controllersubscriber');
        let presetFrontendcontroller = this.presets.includes('preset-frontendcontroller');
        let presetWidgetcontroller = this.presets.includes('preset-widgetcontroller');
        let presetPluginconfiguration = this.presets.includes('preset-pluginconfiguration');

        if (presetAttributeBuilder || presetEmotioninstaller) {
            directoriesToCreate.push(`${this.pluginFolderPath}/Bootstrap`);
        }

        if (presetCronjob || presetControllersubscriber) {
            directoriesToCreate.push(`${this.pluginFolderPath}/Subscriber`);
        }

        if (presetFrontendcontroller) {
            directoriesToCreate.push(
                `${this.pluginFolderPath}/Controllers/Frontend`,
                `${this.pluginFolderPath}/Resources/Views/frontend/frontend_controller`,
            );
        }

        this.fileController.createDirectories(directoriesToCreate);

        this.fileController.createImage(
            `${this.pluginFolderPath}/plugin.png`,
            `${this.templatesFolderPath}/plugin.png`,
        );

        this.fileController.createFile(
            `${this.pluginFolderPath}/plugin.xml`,
            `${this.templatesFolderPath}/plugin.xml.template`,
            [
                ['%pluginName%', this.pluginName],
            ],
        );

        let bootstrapType = 'default';

        if (presetAttributeBuilder && presetEmotioninstaller) {
            bootstrapType = 'mixed';
        } else if (presetAttributeBuilder) {
            bootstrapType = 'attribute-builder';
        } else if (presetEmotioninstaller) {
            bootstrapType = 'emotioninstaller';
        }

        this.fileController.createFile(
            `${this.pluginFolderPath}/${this.pluginName}.php`,
            `${this.templatesFolderPath}/Bootstrap-${bootstrapType}.php.template`,
            [
                ['%pluginName%', this.pluginName],
            ],
        );

        if (presetControllersubscriber) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Subscriber/ControllerSubscriber.php`,
                `${this.templatesFolderPath}/ControllerSubscriber.php.template`,
                [
                    ['%pluginName%', this.pluginName],
                ],
            );
        }

        if (presetCronjob) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Subscriber/CronjobSubscriber.php`,
                `${this.templatesFolderPath}/CronjobSubscriber.php.template`,
                [
                    ['%pluginName%', this.pluginName],
                ],
            );
        }

        let servicesType = '';

        if (presetControllersubscriber && presetCronjob && presetEmotioninstaller) {
            servicesType = 'mixed';
        } else if (presetControllersubscriber && presetCronjob) {
            servicesType = 'cronjob-controller';
        } else if (presetCronjob && presetEmotioninstaller) {
            servicesType = 'cronjob-emotioninstaller';
        } else if (presetControllersubscriber && presetEmotioninstaller) {
            servicesType = 'controller-emotioninstaller';
        } else if (presetControllersubscriber) {
            servicesType = 'controllersubscriber';
        } else if (presetCronjob) {
            servicesType = 'cronjob';
        } else if (presetEmotioninstaller) {
            servicesType = 'emotioninstaller';
        }

        if ('' !== servicesType) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Resources/services.xml`,
                `${this.templatesFolderPath}/services-${servicesType}.xml.template`,
                [
                    ['%pluginName%', this.pluginName],
                    ['%pluginNameSnakeCaseLowercaseNoPrefix%', this.pluginNameSnakeCaseLowercaseNoPrefix],
                    ['%pluginNameSnakeCaseLowercaseNoPrefix%', this.pluginNameSnakeCaseLowercaseNoPrefix],
                ],
            );
        }

        if (presetPluginconfiguration) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Resources/config.xml`,
                `${this.templatesFolderPath}/config.xml.template`,
                [
                    ['%pluginName%', this.pluginName],
                ],
            );
        }

        if (presetCronjob) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Resources/cronjob.xml`,
                `${this.templatesFolderPath}/cronjob.xml.template`,
            );
        }

        if (presetFrontendcontroller) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Resources/Views/frontend/frontend_controller/index.tpl`,
            );
        }

        if (presetAttributeBuilder) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Bootstrap/AttributeBuilder.php`,
                `${this.templatesFolderPath}/AttributeBuilder.php.template`,
                [
                    ['%pluginName%', this.pluginName],
                ],
            );
        }

        if (presetEmotioninstaller) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Bootstrap/Emotioninstaller.php`,
                `${this.templatesFolderPath}/Emotioninstaller.php.template`,
                [
                    ['%pluginName%', this.pluginName],
                ],
            );
        }

        if (presetFrontendcontroller) {
            this.fileController.createFile(
                `${this.pluginFolderPath}/Controllers/Frontend/FrontendController.php`,
                `${this.templatesFolderPath}/FrontendController.php.template`,
            );
        }

        this.fileController.createFile(
            `${this.pluginFolderPath}/Resources/frontend/js/main.js`,
        );

        this.fileController.createFile(
            `${this.pluginFolderPath}/Resources/frontend/less/all.less`,
        );
    }

    determinePluginFolderPath() {
        if (this.fileController.directoryExists('./custom/plugins')) {
            this.pluginFolderPath = `./custom/plugins/${this.pluginName}`;
        } else if (this.fileController.directoryExists('./plugins')) {
            this.pluginFolderPath = `./plugins/${this.pluginName}`;
        }
    }
}
