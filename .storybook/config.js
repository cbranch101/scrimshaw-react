/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from "@storybook/react"

function loadStories() {
    require("../src/demo/stories")
}

configure(loadStories, module)
