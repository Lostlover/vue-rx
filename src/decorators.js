import { Subscription as SubscriptionRx } from "rxjs";
import { defineReactive } from "./util";

export const subscriptionSymbol = Symbol("subscription");

export function Subscription(key, options) {
  return function(vm, name, describer) {
    const curKey = key || `${name}$`;
    const created = vm.created;

    vm.created = function() {
      const context = this;
      defineReactive(context, curKey, undefined);
      const s = context[name]().subscribe(
        value => {
          context[curKey] = value;
        },
        error => {
          throw error;
        }
      );
      context[subscriptionSymbol] = new SubscriptionRx();
      context[subscriptionSymbol].add(s);
      context._subscriptions && vm._subscriptions.add(s);

      typeof created === "function" && created.call(context);
    };
  };
}
