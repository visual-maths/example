const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

/*A number line is a geometric object that includes:
 -a horizontal or vertical axis,
 -tick marks spaced apart from one another on the axis relative to a scale,
 -numbers underneath each tick mark relative to a scale (e.g., counting by 1's, 2's etc),
 -left and right arrowheads to show the line extends indefinitely in either left or right directions.
*/
class NumberLine{
  constructor(width, scale, min, max, x, y) {
    this.width = width;
    this.scale = scale;
    this.min = min;
    this.max = max;
    this.x = x;
    this.y = y;
    this.tickSize = this.width/160;
    this.arrowHeadSize = this.width/160;
    this.numberPositons = [];
  }

  setNumberPositions(){//So that there is a clear correspondence between each tick mark and number on the numberline.
    let max = this.max + 1; //Leave space on the numberline for the right arrowhead.
    let min = this.min - 1; //Leave space on the numberline for the left arrowhead.
    let list = [];
    let n = min;
    for(let i = 1; i < max - min; i++){
      n = n + 1;
      list.push([n, this.x + i*this.scale*(this.width)/(max - min), this.y])
    }
    this.numberPositions = list;
  }
  print(){
    let string = "";
    for(let i = 0; i < this.numberPositions.length; i++){
      string = string + this.toString(this.min + i) + ", " + "\n";
    }
    return string;
  }
  toString(n){
    if(n < this.min || n > this.max){
      throw n + " is outside of the bounds + [" + this.min + ", " + this.max + "]";
    }
    let string = "(number: " + n +
    ", x coordinate: " + this.getXPos(n) +
    ", y coordinate: " + this.getYPos(n) + ")";
    return string;
  }
  getXPos(n){
    return this.numberPositions[n - this.min][1];
  }
  getYPos(n){
    return this.numberPositions[n - this.min][2];
  }
  getNumber(i){
    return this.numberPositions[i][0]
  };
  getIndex(n){
    return n - this.min;
  };
  getUnitDistance(){
    return this.numberPositions[1][1] - this.numberPositions[0][1];
  }

  draw(){
    this.setNumberPositions();
    this.drawAxis();
    this.drawArrowHead(this.x, this.y, 'left');
    this.drawArrowHead(this.x, this.y, 'right');
    this.drawNumbersAndTickMarks(-1*(this.tickSize/2), this.tickSize*3.5, this.tickSize*5);
  }
  drawAxis(){
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y);
    ctx.stroke();
  }
  drawArrowHead(x, y, direction){
    ctx.beginPath();
    switch(direction){
      case 'left':
        ctx.moveTo(x + this.arrowHeadSize, y - this.arrowHeadSize);
        ctx.lineTo(x, y);
        ctx.lineTo(x + this.arrowHeadSize, y + this.arrowHeadSize);
        break;
      case 'right':
        ctx.moveTo(x + this.width - this.arrowHeadSize, y - this.arrowHeadSize);
        ctx.lineTo(x + this.width, y);
        ctx.lineTo(x + this.width - this.arrowHeadSize, y + this.arrowHeadSize);
        break;
    }
    ctx.stroke();
  }
  drawNumbersAndTickMarks(alignX, alignY, fontSize){//alignX and alignY are needed to help 'centre' numbers underneath the tick mark.
    ctx.font = fontSize + "px serif";
    for(let i = 0; i < this.numberPositions.length; i++){
      let n = this.getNumber(i);
      if(n < -9){//different alignment for 2-digit numbers and 1-digit numbers
        ctx.fillText(n, this.getXPos(n) + 8.5*alignX, this.getYPos(n) + 1.5*alignY);
      }
      else if(n < 0){// need different alignement for negative numbers and positive numbers.
        ctx.fillText(n, this.getXPos(n) + 6*alignX, this.getYPos(n) + 1.5*alignY);
      }
      else if(0 <= n && n <= 9){
        ctx.fillText(n, this.getXPos(n) + 2.5*alignX, this.getYPos(n) + 1.5*alignY);
      }
      else{
        ctx.fillText(n, this.getXPos(n) + 5*alignX, this.getYPos(n) + 1.5*alignY);
      }
      ctx.moveTo(this.getXPos(n), this.getYPos(n) - this.tickSize); //tick marks
      ctx.lineTo(this.getXPos(n), this.getYPos(n) + this.tickSize);
    }
    ctx.stroke();
  }
}

/*A math problem in this context is any number expression that has 2 numbers and one operator,
  either (+) or (-), yet to be evalated, e.g.,(3 + 5 = ?).
  Math problems will need to be written and displayed alongisde the numberline.
  Students use the Visualiser (see below) to help solve the math problem. */
class MathProblem{
  constructor(x, y, operator, numberA, numberB, fontSize){
    this.x = x;
    this.y = y;
    this.operator = operator;
    this.numberA = numberA;
    this.numberB = numberB;
    this.fontSize = fontSize;
  }
  solve(){
    switch(this.operator){
      case 'add':
        return this.numberA + this.numberB;
      case 'subtract':
        return this.numberA - this.numberB;
      case 'multiply':
        return this.numberA*this.numberB;
      case 'divide':
        return this.numberA/this.numberB;
    }
  }
  draw(m){
      this.erase();
      let numExpr = this.toString(m);
      ctx.font = this.fontSize + "px serif";
      ctx.fillText(numExpr, this.x, this.y);
  }
  erase(){
    ctx.clearRect(this.x, this.y - this.fontSize, this.fontSize*6, this.fontSize);
  }
  toString(m){
    let sign = "";
    switch(this.operator){
      case 'add':
        sign = "+";
        break;
      case 'subtract':
        sign = "-";
        break;
      case 'multiply':
        sign = "×";
        break;
      case 'divide':
        sign = "÷";
        break;
    }
    if(m == 1){
      return this.numberA;
    }
    if(m == 2){
      return this.numberA + " " + sign;
    }
    if(m == 3){
      return this.numberA + " " + sign + " " + this.numberB;
    }
    else{
      return this.numberA + " " + sign + " " + this.numberB + " = " + this.solve();
    }
  }
}

/*The purpose of the visualiser is to provide the dynamic, visual elements to
  support the user in solving math problems with the number line.*/
class Visualiser{
  constructor(numberline, mathProblem){
    this.numberline = numberline;
    this.mathProblem = mathProblem;
  }
  animateSteps(){
    let n = this.mathProblem.numberA;
    let index = this.numberline.getIndex(n);
    let xPos = this.numberline.getXPos(n);
    let yPos = this.numberline.getYPos(n);
    let stepLength = this.numberline.getUnitDistance()/2;
    let numOfSteps = Math.abs(this.mathProblem.numberB);
    let op = this.mathProblem.operator;
    let stepDuration = 1*1000;
    let i = -4; //track stages of the animation
    if(this.mathProblem.solve() < this.numberline.min ||
       this.mathProblem.solve() > this.numberline.max){
         let outOfBoundsMessage = "The answer to " + this.mathProblem.toString(3) +
                        " is outside the bounds, " + "(" + this.numberline.min + ", "
                        + this.numberline.max + "), " + " of the number line."
         ctx.font = this.mathProblem.fontSize + "px serif";
         ctx.fillText('The answer does not fit on this numberline', canvas.width/6, this.mathProblem.fontSize*1.5);
         return console.log(outOfBoundsMessage);
    }
    const animate = setInterval(() => {
      if(i == -4){
        this.mathProblem.draw(1);
        i++;
      }
      else if(i == -3){
        this.drawStartPoint();
        xPos = this.numberline.getXPos(n);
        this.drawSprite(xPos - 2*this.numberline.tickSize, yPos - 16*this.numberline.tickSize, 'stand');
        i++;
      }
      else if(i == -2){
        this.mathProblem.draw(2);
        i++;
      }
      else if(i == -1){
        if(op == 'add'){
          this.drawSprite(xPos - 2.5*this.numberline.tickSize, yPos - 16*this.numberline.tickSize, 'lookRight');
        }
        if(op == 'subtract'){
          this.drawSprite(xPos - 2.5*this.numberline.tickSize, yPos - 16*this.numberline.tickSize, 'lookLeft');
        }
        i++;
      }
      else if(i == 0){
        this.mathProblem.draw(3);
        i++;
      }
      else if(i <= numOfSteps){
        if(op == 'add' && this.mathProblem.numberB >=0){
          xPos = this.numberline.getXPos(n + i);
          this.animateStep(xPos - stepLength, yPos, stepLength, 'right', stepDuration);
        }
        if(op == 'subtract' && this.mathProblem.numberB < 0){
          xPos = this.numberline.getXPos(n + i);
          this.animateStep(xPos - stepLength, yPos, stepLength, 'right', stepDuration);
        }
        if(op == 'add' && this.mathProblem.numberB < 0){
          xPos = this.numberline.getXPos(n - i);
          this.animateStep(xPos + stepLength, yPos, stepLength, 'left', stepDuration);
        }
        if(op == 'subtract' && this.mathProblem.numberB >=0){
          xPos = this.numberline.getXPos(n - i);
          this.animateStep(xPos + stepLength, yPos, stepLength, 'left', stepDuration);
        }
        i++;
      }else{
        this.mathProblem.draw();
        clearInterval(animate);}
    }, stepDuration);
  }
  animateStep(x, y, radius, direction, duration){
    const frames = 20;
    let startAngle = 0;
    let endAngle = 0;
    let angleIncrement = 0;
    switch(direction){ //declare initial state values depending on whether a step to the left or right is taken.
      case 'left':
        startAngle = 2*Math.PI; //start semicircle from the RIGHT.
        endAngle = Math.PI; //end semicircle on the LEFT.
        angleIncrement = (endAngle - startAngle)/frames;
        break;
      case 'right':
        startAngle = Math.PI; //start semicircle from the LEFT.
        endAngle = 2*Math.PI; //end semicircle on the RIGHT.
        angleIncrement = (endAngle - startAngle)/frames;
        break;
    }
    function animate(){
        switch(direction){
          case 'left':
            if(startAngle + angleIncrement > endAngle){
              ctx.beginPath();
              ctx.arc(x, y, radius, startAngle, startAngle + angleIncrement, true); //go anticlockwise
              ctx.stroke();
              startAngle = startAngle + angleIncrement;
              setTimeout(animate, duration/frames);
            }
            else{
              ctx.beginPath();
              ctx.arc(x, y, radius, startAngle, endAngle, true); //go anti-clockwise
              ctx.stroke();
            }
            break;
          case 'right':
            if(startAngle + angleIncrement < endAngle){
              ctx.beginPath();
              ctx.arc(x, y, radius, startAngle, startAngle + angleIncrement); //go clockwise
              ctx.stroke();
              startAngle = startAngle + angleIncrement;
              setTimeout(animate, duration/frames);
            }
            else{
              ctx.beginPath();
              ctx.arc(x, y, radius, startAngle, endAngle); //go clockwise
              ctx.stroke();
            }
            break;
        }
      }
    animate();
    }
  drawStartPoint(){
    let n = this.mathProblem.numberA;
    let index = this.numberline.getIndex(n);
    let xPos = this.numberline.getXPos(n);
    let yPos = this.numberline.getYPos(n);
    ctx.beginPath();
    ctx.arc(xPos, yPos, this.numberline.tickSize, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
  }
  drawSteps(){
    let n = this.mathProblem.numberA;
    let index = this.numberline.getIndex(n);
    let xPos = this.numberline.getXPos(n);
    let yPos = this.numberline.getYPos(n);
    let stepLength = this.numberline.getUnitDistance()/2;
    let numOfSteps = Math.abs(this.mathProblem.numberB);
    let op = this.mathProblem.operator;
    ctx.beginPath();
    if((this.mathProblem.numberB < 0 && this.mathProblem.operator == 'add')
    || (this.mathProblem.numberB >= 0 && this.mathProblem.operator == 'subtract')){
      for(let i = 0; i < numOfSteps; i++){
        xPos = this.numberline.getXPos(n - i);
        ctx.arc(xPos - stepLength, yPos, stepLength, Math.PI, 0);
      }
    }else{//FIX: note it will apply to 'multiply' and 'divide', this shouldn't be the case.
      for(let i = 0; i < numOfSteps; i++){
        xPos = this.numberline.getXPos(n + i);
        ctx.arc(xPos + stepLength, yPos, stepLength, Math.PI, 0);
      }
    }
    ctx.stroke();
  }
  drawSprite(x, y, action){
    const img = new Image();
    img.addEventListener("load", () => {
      ctx.drawImage(img, x, y, img.width*0.2, img.height*0.2);
    });
    switch(action){
      case 'stand':
        img.src = "sprite-stand.png";
        break;
      case 'lookLeft':
        img.src = "sprite-look-left.png";
        break;
      case 'lookRight':
        img.src = "sprite-look-right.png";
        break;
    }
  }
}

function myFunction() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const numberline = new NumberLine(600, 1, -10, 10, 50, 150, 30);
  numberline.draw();
  let operator = '';
  if(document.getElementById('operator').value == '+'){
    operator = 'add';
  }
  if(document.getElementById('operator').value == '-'){
    operator = 'subtract';
  }
  let numberA = Number(document.getElementById('numberA').value);
  let numberB = Number(document.getElementById('numberB').value);
  const mathProblem = new MathProblem(300, 40, operator, numberA, numberB, 25);
  const visualiser = new Visualiser(numberline, mathProblem);
  visualiser.animateSteps();
}



/*TODO (30-01-25):
1. Add input fields.
2.FIX: scale feature of the numberline.
*/
