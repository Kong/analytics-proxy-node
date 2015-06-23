# mashape-analytics-proxy-node

> simple proxy tool for Mashape Analytics

## Notes

- currently only operates on plain HTTP calls (no SSL)
- no error handling of disconnected sockets, net issues. just restart it
- relies on [`analytics-agent-node`](https://github.com/Mashape/analytics-agent-node)

## Usage

```
PORT=8080 TOKEN=xxx npm start
```

## Environment Variables

| name          | description                                                       | required | default |
| ------------- | ----------------------------------------------------------------- | -------- | ------- |
| `PORT`        | proxy port                                                        | yes      | `-`     |
| `TOKEN`       | Mashape Analytics Token                                           | yes      | `-`     |
| `ENVIRONMENT` | Mashape Analytics Environment                                     | no       | `-`     |
| `BATCH`       | ALF count per request                                             | no       | `1`     |
| `ENTRIES`     | Entries count per HAR                                             | no       | `1`     |
| `NODE_DEBUG`  | enable console logging by setting the value to `analytics-proxy`  | no       | `-`     |

### Analytics Agent Debugging

set `NODE_DEBUG` to `analytics-proxy,mashape-analytics` to see logs from both the proxy and the agent.

## License

[ISC License](LICENSE) &copy; [Ahmad Nassri](https://www.ahmadnassri.com/)

[license-url]: https://github.com/Mashape/mashape-analytics-proxy-node/blob/master/LICENSE
