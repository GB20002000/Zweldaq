const count = document.getElementById("count");
const ucount = document.getElementById("ucount");
const billcount = document.getElementById("billcount");
const Set_Value_Element = document.getElementById("Set_Value");

const storedLastName = localStorage.getItem("lastname");
if (storedLastName) {
  Set_Value_Element.innerText = storedLastName;
}

const broker = "wss://1fae4ab464e64fe9be19c16c1101c1be.s1.eu.hivemq.cloud:8884/mqtt";
const options = {
  clientId: "web_" + crypto.randomUUID(),
  username: "Check",
  password: "2025Black",
  clean: true
};

const client = mqtt.connect(broker, options);

client.on("connect", () => {
  console.log("Connected to HiveMQ Cloud");
  client.subscribe("Switch");
  client.subscribe("Switch2");
  client.subscribe("Switch3");
  client.subscribe("Alert1");
  client.subscribe("Alert2");

  if (storedLastName) {
    client.publish("seet_value", storedLastName);
  }
});

client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(`Message on ${topic}:`, data);

    if (topic === "Switch") {
      count.innerHTML = `${data.voltage} ${data.Vunit}`;
    } else if (topic === "Switch2") {
      ucount.innerHTML = `${data.voltage} ${data.Vunit}`;
    } else if (topic === "Switch3") {
      billcount.innerHTML = `${data.voltage} ${data.Vunit}`;
      Set_Value_Element.innerHTML = `${data.voltage} ${data.Vunit}`;
    } 
    // You can add handling for Alert1 and Alert2 here if needed
  } catch (error) {
    console.error("Error parsing MQTT message:", error);
  }
});
