export function uuid(prefix) {
    const id = Math.floor(Math.random() * 10000).toString(36)
    return prefix
      ? ~prefix.indexOf('%{s}')
        ? prefix.replace(/%\{s\}/g, id)
        : prefix + id
      : id
  }
  