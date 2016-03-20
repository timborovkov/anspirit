//Arduino sketch for QHub built in Q OS by Anspirit.

int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  Serial.begin(9600);
}

void loop() {
  if(Serial.available() > 0){
    char letter = Serial.read();

    if(letter == '1'){
      digitalWrite(ledPin, HIGH);
      Serial.println("LED is on");
    }else if(letter == '0'){
      digitalWrite(ledPin, LOW);
      Serial.println("LED is off");
    }
  }
}
