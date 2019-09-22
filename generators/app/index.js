"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const { resolve } = require("path");
const remote = require("yeoman-remote");
const yoHelper = require("yeoman-generator-helper");
const replace = require("replace-in-file");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the stunning ${chalk.red("generator-github")} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "project_name",
        message: "Your project_name (eg: like this `react-button` )?",
        default: yoHelper.discoverRoot
      },
      {
        type: "input",
        name: "description",
        message: "Your description?"
      },
      {
        type: "input",
        name: "homepage",
        message: "Your homepage?",
        default: "https://github.com/afeiship"
      },
      {
        type: "input",
        name: "author",
        message: "Your author?",
        default: "afei"
      },
      {
        type: "input",
        name: "email",
        message: "Your email?",
        default: "1290657123@qq.com"
      }
    ];

    return this.prompt(prompts).then(
      function(props) {
        // To access props later use this.props.someAnswer;
        this.props = props;
        yoHelper.rewriteProps(props, {
          exclude: ["email", "description", "author", "homepage"]
        });
      }.bind(this)
    );
  }

  writing() {
    const done = this.async();
    remote(
      "afeiship",
      "boilerplate-github",
      function(err, cachePath) {
        // copy files:
        this.fs.copy(
          glob.sync(resolve(cachePath, "{**,.*}")),
          this.destinationPath()
        );
        done();
      }.bind(this)
    );
  }

  end() {
    const { project_name, homepage, author, email, description } = this.props;
    const files = glob.sync(resolve(this.destinationPath(), "{**,.*}"));

    replace.sync({
      files,
      from: [
        /boilerplate-github-description/g,
        /boilerplate-github-homepage/g,
        /boilerplate-github-author/g,
        /boilerplate-github-email/g,
        /boilerplate-github/g
      ],
      to: [description, homepage, author, email, project_name]
    });
  }
};
