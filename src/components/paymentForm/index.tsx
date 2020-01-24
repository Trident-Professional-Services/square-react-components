import React, { useEffect, useState } from "react";
import "./paymentForm.css";

declare class SqPaymentForm {
  constructor(any);
  build(): void;
  destroy(): void;
  requestCardNonce(): void;
}

interface ICallbackMethods {
  googlePay: boolean;
  applePay: boolean;
  masterpass: boolean;
}

interface IInputEvent {
  cardBrand: string;
  eventType: string;
}

const styles = {
  name: {
    verticalAlign: "top",
    display: "none",
    margin: 0,
    border: "none",
    fontSize: "16px",
    fontFamily: "Helvetica Neue",
    padding: "16px",
    color: "#373F4A",
    backgroundColor: "transparent",
    lineHeight: "1.15em",
    placeholderColor: "#000",
    _webkitFontSmoothing: "antialiased",
    _mozOsxFontSmoothing: "grayscale"
  },
  leftCenter: {
    float: "left",
    textAlign: "center"
  },
  blockRight: {
    display: "block",
    float: "right"
  },
  center: {
    textAlign: "center"
  }
};

export interface IPaymentFormProps {
  application_id: string;
  location_id: string;
  submitCheckout: (nonce: string) => void;
}
export const PaymentForm = (props: IPaymentFormProps) => {
  const { application_id, location_id, submitCheckout } = props;
  const [applePay, setApplePay] = useState(false);
  const [masterpass, setMasterpass] = useState(false);
  const [googlePay, setGooglePay] = useState(false);
  const [cardBrand, setCardBrand] = useState("");
  const [nonce, setNonce] = useState();
  const [paymentForm, setPaymentForm] = useState<SqPaymentForm>();

  const initialize = () => {
    const config = {
      applicationId: application_id,
      locationId: location_id,
      inputClass: "sq-input",
      autoBuild: false,
      inputStyles: [
        {
          fontSize: "16px",
          fontFamily: "Helvetica Neue",
          padding: "16px",
          color: "#373F4A",
          backgroundColor: "transparent",
          lineHeight: "1.15em",
          placeholderColor: "#000",
          _webkitFontSmoothing: "antialiased",
          _mozOsxFontSmoothing: "grayscale"
        }
      ],
      applePay: {
        elementId: "sq-apple-pay"
      },
      masterpass: {
        elementId: "sq-masterpass"
      },
      googlePay: {
        elementId: "sq-google-pay"
      },
      cardNumber: {
        elementId: "sq-card-number",
        placeholder: "• • • •  • • • •  • • • •  • • • •"
      },
      cvv: {
        elementId: "sq-cvv",
        placeholder: "CVV"
      },
      expirationDate: {
        elementId: "sq-expiration-date",
        placeholder: "MM/YY"
      },
      postalCode: {
        elementId: "sq-postal-code",
        placeholder: "Zip"
      },
      callbacks: {
        methodsSupported: (methods: ICallbackMethods) => {
          if (methods.googlePay) {
            setGooglePay(methods.googlePay);
          }
          if (methods.applePay) {
            setApplePay(methods.applePay);
          }
          if (methods.masterpass) {
            setMasterpass(methods.masterpass);
          }
          return;
        },
        createPaymentRequest: () => {
          return {
            requestShippingAddress: false,
            requestBillingInfo: true,
            currencyCode: "USD",
            countryCode: "US",
            total: {
              label: "Indo Expo Test",
              amount: "100",
              pending: false
            },
            lineItems: [
              {
                label: "Subtotal",
                amount: "100",
                pending: false
              }
            ]
          };
        },
        cardNonceResponseReceived: (errors: Error[], nonce: any) => {
          if (errors) {
            // Log errors from nonce generation to the Javascript console
            console.log("Encountered errors:");
            errors.forEach(function(error) {
              console.log("  " + error.message);
            });

            return;
          }
          setNonce(nonce);
          submitCheckout(nonce);
        },
        unsupportedBrowserDetected: () => {},
        inputEventReceived: (inputEvent: IInputEvent) => {
          switch (inputEvent.eventType) {
            case "focusClassAdded":
              break;
            case "focusClassRemoved":
              break;
            case "errorClassAdded":
              const errorElement1 = document.getElementById("error");
              if (errorElement1) {
                errorElement1.innerHTML =
                  "Please fix card information errors before continuing.";
              }
              break;
            case "errorClassRemoved":
              const errorElement = document.getElementById("error");
              if (errorElement) {
                errorElement.style.display = "none";
              }
              break;
            case "cardBrandChanged":
              if (inputEvent.cardBrand !== "unknown") {
                setCardBrand(inputEvent.cardBrand);
              } else {
                setCardBrand("");
              }
              break;
            case "postalCodeChanged":
              break;
            default:
              break;
          }
        },
        paymentFormLoaded: function() {
          const nameInput = document.getElementById("name");
          if (nameInput) {
            nameInput.style.display = "inline-flex";
          }
        }
      }
    };
    const paymentForm = new SqPaymentForm(config);
    paymentForm.build();
    setPaymentForm(paymentForm);
  };
  const requestCardNonce = () => {
    if (paymentForm) {
      paymentForm.requestCardNonce();
    } else {
      throw new Error("Payment form is undefined!");
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="container">
      <div id="form-container">
        <div id="sq-walletbox">
          <button
            style={{ display: applePay ? "inherit" : "none" }}
            className="wallet-button"
            id="sq-apple-pay"
          ></button>
          <button
            style={{ display: masterpass ? "block" : "none" }}
            className="wallet-button"
            id="sq-masterpass"
          ></button>
          <button
            style={{ display: googlePay ? "inherit" : "none" }}
            className="wallet-button"
            id="sq-google-pay"
          ></button>
          <hr />
        </div>

        <div id="sq-ccbox">
          <p>
            <span style={styles.leftCenter as React.CSSProperties}>
              Enter Card Info Below{" "}
            </span>
            <span style={styles.blockRight as React.CSSProperties}>
              {cardBrand.toUpperCase()}
            </span>
          </p>
          <div id="cc-field-wrapper">
            <div id="sq-card-number"></div>
            <input type="hidden" id="card-nonce" name="nonce" />
            <div id="sq-expiration-date"></div>
            <div id="sq-cvv"></div>
          </div>
          <input
            id="name"
            style={styles.name as React.CSSProperties}
            type="text"
            placeholder="Name"
          />
          <div id="sq-postal-code"></div>
        </div>
        <button className="button-credit-card" onClick={requestCardNonce}>
          Pay
        </button>
      </div>
      <p style={styles.center as React.CSSProperties} id="error"></p>
    </div>
  );
};
