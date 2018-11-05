# babel-plugin-danger-remove-unused-import

[![Build status](https://img.shields.io/travis/imcuttle/babel-plugin-danger-remove-unused-import/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/babel-plugin-danger-remove-unused-import)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/babel-plugin-danger-remove-unused-import.svg?style=flat-square)](https://codecov.io/github/imcuttle/babel-plugin-danger-remove-unused-import?branch=master)
[![NPM version](https://img.shields.io/npm/v/babel-plugin-danger-remove-unused-import.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-danger-remove-unused-import)
[![NPM Downloads](https://img.shields.io/npm/dm/babel-plugin-danger-remove-unused-import.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/babel-plugin-danger-remove-unused-import)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

For shrinking the bundled javascript size :smile:

**Note: remove unused import is dangerous**  
**because the imported package may have some side effects!**

## Option

```javascript
{
  ignore: ['react']
}
```

## Input

```javascript
import React from 'react'
import Button from 'button'
import _ from 'lodash'
import moment from 'moment'
import { data } from '../some-where'

// ...

const a = {}
a.moment = <Button x={data} />
```

## Output

```diff
import React from 'react'
import Button from 'button'
- import _ from 'lodash'
- import moment from 'moment'
import {data} from '../some-where'

// ...

const a = {}
a.moment = <Button x={data} />
```

## Todo

- [ ] Supporting Scope
