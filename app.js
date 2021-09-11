#!/usr/bin/env node

'use strict';

import inquirer from 'inquirer';
import Rx from 'rxjs';
import PluginController from './Controller/plugin.controller.mjs';

const pluginController = new PluginController();
const prompts = new Rx.Subject();

let questions = [
    {
        type: 'input',
        name: 'plugin-name',
        message: 'Plugin name?',
        validate: function (input) {
            return input !== '';
        }
    },
    {
        type: 'checkbox',
        name: 'plugin-presets',
        message: 'Choose presets:',
        choices: [
            {
                name: 'Attribute Builder',
                value: 'preset-attribute-builder',
            },
            {
                name: 'Cronjob',
                value: 'preset-cronjob',
            },
            {
                name: 'Emotioninstaller',
                value: 'preset-emotioninstaller',
            },
            {
                name: 'Controller subscriber',
                value: 'preset-controllersubscriber',
            },
            {
                name: 'Frontend controller',
                value: 'preset-frontendcontroller',
            },
            {
                name: 'Widget controller',
                value: 'preset-widgetcontroller',
            },
            {
                name: 'Plugin configuration',
                value: 'preset-pluginconfiguration',
            },
        ]
    }
];

inquirer.prompt(prompts).ui.process.subscribe(
    async function (event) {
        let nextQuestion = null;

        switch (event.name) {
            case 'plugin-name':
                pluginController.pluginName = event.answer;
                nextQuestion = questions[1];
                break;
            case 'plugin-presets':
                pluginController.presets = event.answer;
                break;
        }

        if (nextQuestion) {
            prompts.next(nextQuestion);
        } else {
            pluginController.createPlugin();
            prompts.complete();
        }
    }
);

prompts.next(questions[0]);
