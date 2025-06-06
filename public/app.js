const current= document.getElementById('current');
const voltage=document.getElementById('voltage');
const feeding_rate=document.getElementById('feeding_rate');
const device_id=document.getElementById('device_id')
const datetime=document.getElementById('datetime')
const Status=document.getElementById('Status')
const json_data=document.getElementById('json_data')
const broker = "wss://b80fbd3540024c028b9515accaa12fb5.s1.eu.hivemq.cloud:8884/mqtt";
const options = {
  clientId: "web_" + crypto.randomUUID(),
  username: "Zweldaq",
  password: "Zweldaq_V2",
  clean: true
};
function updatetime(){
  datetime.innerHTML=new Date().toLocaleString()
}
updatetime();
setInterval(updatetime,1000)
const client = mqtt.connect(broker, options);

client.on("connect", () => {
  console.log("Connected to HiveMQ Cloud");
  client.subscribe("zweldaq_data");
  client.subscribe('status');
});

client.on("message", async (topic, message) => {
  const msgStr = message.toString();
  try {
    const data = JSON.parse(message.toString());
    console.log(`Message on ${topic}:`, data);

    if (topic === "zweldaq_data") {
      device_id.innerHTML=data.device_id
      voltage.innerHTML = `${data.Voltage} ${data.vunit}`;
      current.innerHTML=`${data.current} ${data.cunit}`;
      feeding_rate.innerHTML=`${data.feedingvalue}`;
      json_data.innerHTML=JSON.stringify(data);
    } 
    if(topic==='status'){
       Status.innerHTML = data.status || JSON.stringify(data);

    }
  } catch (error) {
    console.error("Error parsing MQTT message:", error);
     console.warn("Non-JSON message received:", msgStr);

    if (topic === "status") {
      Status.innerHTML = msgStr;
    }
  }
});
