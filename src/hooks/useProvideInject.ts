import { inject, provide, Ref } from 'vue';

const useProvideInject = <T>(name: string, provideData?: Ref<T>) => {
  provide<Ref<T> | undefined>(name, provideData);
  const injectSource = inject<Ref<T>>(name);

  return injectSource;
};

export { useProvideInject };
