class Lumenation {

    constructor() {

        this.dayElement = document.getElementById('day')
        this.monthElement = document.getElementById('month')
        this.colorElement = document.getElementById('color')
        this.buttonElement = document.getElementById('lumenati')
        this.nameElement = document.getElementById('name')

        this.copyElement = document.getElementById('copy')

        this.lumenations = ''

        this.canvasElement = document.getElementById('canvas')
        this.ctx = canvas.getContext('2d')

        this.fontFamily = 'Arial'
        this.fontSize = '24px'
        this.fontColour = 'white'
    }

    lumenate() {
        const values = this.getValues()
        const message = this.buildLumene(values)

        this.drawImage(message)
        this.setAttrs(values)
        this.setWhatsppShare()
        this.setTwitterShare(message)
        
    }

    getAttrs() {
        let attrs = atob(window.location.hash.substr(1)).split(',');
        if (attrs.length < 3) {
            return Promise.reject('Attributes Not Found');
        }
        return attrs;
    }

    setAttrs({ day, month, color, name }) {
        window.location.hash = btoa(`${day},${month},${color},${name}`);
    }

    getValues() {
        let day = this.dayElement.value,
            month = this.monthElement.value,
            color = this.colorElement.value,
            name = this.nameElement.value;

        return { day, month, color, name }
    }

    setValues(values) {
        if(values.length != 4){
            return
        }
        const [ day, month, color, name ] = values

        this.dayElement.value = day;
        this.monthElement.value = month
        this.colorElement.value = color
        this.nameElement.value = name

        return { day, month, color, name }
    }

    buildLumene({ day, month, color, name }) {
        let dayLumene = this.lumenations.dias.find(value => value.dia == day).frase,
            monthLumene = this.lumenations.meses.find(value => value.mes == month).frase,
            colorLumene = this.lumenations.cores.find(value => value.cor == color).frase;

        return `${name}, você ${dayLumene.toLowerCase()} ${monthLumene} ${colorLumene}!`
    }

    loadBackground() {
        this.background = new Image(580, 326);
        this.background.src = 'assets/images/lumena.jpg';

        return Promise.resolve(this.background);
    }

    loadBrain() {
        return fetch("./assets/fraseslumena.json", {
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }).then(res => res.json())
            .then(res => this.lumenations = res)
    }

    copyUrl() {
        const copyTextElement = document.querySelector('#copy span')

        navigator.clipboard.writeText(window.location.href)
        copyTextElement.innerHTML = 'Copiado!'

        setTimeout(() => {
            copyTextElement.innerHTML = 'Copiar Link'
        }, 1000)
    }

    setWhatsppShare() {
        document.getElementById('share').setAttribute('href', 'whatsapp://send?text=' + document.location)
    }

    setTwitterShare(text) {
        document.getElementById('twitter').setAttribute('href', 'https://twitter.com/intent/tweet?url='+ encodeURIComponent(document.location) +'&text= ' + encodeURIComponent(text.substring(0,144)) )
    }

    setListeners() {
        this.dayElement.addEventListener('change', () => this.clearImage())
        this.monthElement.addEventListener('change', () => this.clearImage())
        this.colorElement.addEventListener('change', () => this.clearImage())
        this.buttonElement.addEventListener('click', () => this.lumenate())
        this.copyElement.addEventListener('click', () => this.copyUrl())

        return Promise.resolve()
    }

    fragmentText(text, maxWidth) {
        var words = text.split(' '),
            lines = [],
            line = "";
        if (this.ctx.measureText(text).width < maxWidth) {
            return [text];
        }
        while (words.length > 0) {
            while (this.ctx.measureText(words[0]).width >= maxWidth) {
                var tmp = words[0];
                words[0] = tmp.slice(0, -1);
                if (words.length > 1) {
                    words[1] = tmp.slice(-1) + words[1];
                } else {
                    words.push(tmp.slice(-1));
                }
            }
            if (this.ctx.measureText(line + words[0]).width < maxWidth) {
                line += words.shift() + " ";
            } else {
                lines.push(line);
                line = "";
            }
            if (words.length === 0) {
                lines.push(line);
            }
        }
        return lines;
    }

    clearImage() {
        this.drawImage('');
    }

    drawImage(text) {
        const width = this.canvasElement.width

        this.ctx.font = 'bold ' + this.fontSize + ' ' + this.fontFamily;
        this.ctx.textAlign = "center";
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = this.fontColour;
        this.ctx.drawImage(this.background, 0, 0);
        var lines = this.fragmentText(text, width - parseInt(this.fontSize, 0));

        lines.forEach((line, i) => {
            this.ctx.strokeText(line, width / 2, (i + 7) * parseInt(this.fontSize, 0));
            this.ctx.fillText(line, width / 2, (i + 7) * parseInt(this.fontSize, 0));
        });

        const imageElement = document.getElementById('lumenation')
        const img = this.canvasElement.toDataURL()

        imageElement.src = img

    }
}

let lumenation = new Lumenation()

lumenation.loadBrain()
    .then(() => {
        lumenation.loadBackground()
        lumenation.setListeners()

        const values = lumenation.getAttrs()
        lumenation.setValues(values)

        lumenation.lumenate()

    })
  //  .catch(err => console.log('Error: ' +  err))
