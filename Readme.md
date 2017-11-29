# babel-plugin-danger-remove-unused-import


 To shrink the bundle javascript size :smile:

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
import {data} from '../some-where'

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