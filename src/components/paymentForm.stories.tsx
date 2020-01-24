import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { PaymentForm } from "./paymentForm";
import * as Configuration from "../config.json";

export const actions = {
  submitCheckout: action("submitCheckout", { allowFunction: true })
};

storiesOf("PaymentForm", module).add("default", () => (
  <PaymentForm
    application_id={Configuration.application_id}
    countryCode={"US"}
    currencyCode={"USD"}
    label="Storybook Example"
    lineItems={[{ label: "Sub Total", amount: 100, pending: false }]}
    location_id={Configuration.location_id}
    pending={false}
    {...actions}
  />
));
