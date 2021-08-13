Example:

```
#!/bin/bash
curl -XPOST "localhost:3102/run" -H "content-type: application/json" -d '{"source": "let x = 5 in x"}'
```
