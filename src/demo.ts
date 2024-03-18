import { useRouter, useRoute } from "vue-router";

const loaclKey = "loaclKey";
const cache: Record<string, any> = {};

export const push = (path: string, query: Record<string, any>) => {
  const router = useRouter();
  router.push(path);
  cache[path] = query;

  window.localStorage.setItem(loaclKey, JSON.stringify(cache));
};

export const get = () => {
  const route = useRoute();
  const path = route.path;
  const localCache = window.localStorage.getItem(loaclKey);
  Object.assign(cache, JSON.parse(localCache || "{}"));

  return cache[path];
};
