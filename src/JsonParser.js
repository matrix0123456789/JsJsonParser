export class JsonParser {
    constructor(text) {
        this.text = text;
        this.position = 0;
    }

    static parse(text) {
        return (new JsonParser(text)).parseAll();
    }

    throw() {
        throw new Error("JSON syntax error on position: " + this.position);
    }

    parseAll() {
        this.skipWhitespaces();
        if (this.position === this.text.length) {
            this.throw();
        }
        const ret = this.parseItem();
        this.skipWhitespaces();
        if (this.position !== this.text.length) {
            this.throw();
        }
        return ret;
    }

    skipWhitespaces() {
        while (this.position < this.text.length) {
            if (/\s/.test(this.char())) {
                this.position++;
            } else {
                return;
            }
        }
    }

    char() {
        return this.text[this.position];
    }

    parseItem() {
        this.skipWhitespaces();
        if (this.char() == '{') {
            return this.parseObject();
        } else if (this.char() == '[') {
            return this.parseArray()
        } else if (this.char() == '"') {
            return this.parseString();
        } else if (/[-0-9]/.test(this.char())) {
            return this.parseNumber();
        } else if (this.text.substring(this.position, this.position + 4) == 'true') {
            this.position += 4;
            return true;
        } else if (this.text.substring(this.position, this.position + 4) == 'null') {
            this.position += 4;
            return null;
        } else if (this.text.substring(this.position, this.position + 5) == 'false') {
            this.position += 5;
            return false;
        }else{
            this.throw();
        }
    }

    parseNumber() {
        let ret = "";
        while (this.position < this.text.length) {
            if (/[0-9e\.+-]/.test(this.char())) {
                ret += this.char();
                this.position++;
            } else {
                break;
            }
        }
        if (/^-?0+[0-9]/.test(ret)) {
            this.throw();
        } else if (/^\+/.test(ret)) {
            this.throw();
        }
        return parseFloat(ret);
    }

    parseString() {
        let ret = "";
        this.skipWhitespaces();
        if (this.char() != '"') {
            this.throw();
        }
        this.position++;
        while (this.position < this.text.length) {
            if (this.char() == '"') {
                this.position++;
                return ret;
            } else if (this.char() == '\\') {
                this.position++;
                if (this.char() == '\\') {
                    this.position++;
                    ret += '\\';
                } else if (this.char() == '/') {
                    this.position++;
                    ret += '/';
                } else if (this.char() == 'n') {
                    this.position++;
                    ret += '\n';
                } else if (this.char() == 'r') {
                    this.position++;
                    ret += '\r';
                } else if (this.char() == 't') {
                    this.position++;
                    ret += '\t';
                } else if (this.char() == 'b') {
                    this.position++;
                    ret += '\b';
                } else if (this.char() == 'f') {
                    this.position++;
                    ret += '\f';
                } else if (this.char() == '"') {
                    this.position++;
                    ret += '"';
                } else if (this.char() == 'x') {
                    this.position++;
                    const charCode = parseInt(this.text.substring(this.position, this.position + 2), 16)
                    this.position += 2;
                    ret += String.fromCharCode(charCode);
                } else if (this.char() == 'u') {
                    this.position++;
                    const charCode = parseInt(this.text.substring(this.position, this.position + 4), 16)
                    this.position += 4;
                    ret += String.fromCharCode(charCode);
                } else {
                    this.throw();
                }
            } else {
                ret += this.char();
                this.position++;
            }
        }

        this.throw()
    }

    parseArray() {
        let ret = [];
        this.skipWhitespaces();
        if (this.char() != '[') {
            this.throw();
        }
        this.position++;
        this.skipWhitespaces();
        if (this.char() == ']') {
            this.position++;
            return ret;
        }
        ret.push(this.parseItem())
        while (this.position < this.text.length) {
            this.skipWhitespaces();
            if (this.char() == ']') {
                this.position++;
                return ret;
            } else if (this.char() == ',') {
                this.position++;
                this.skipWhitespaces();
                ret.push(this.parseItem())
            } else {
                this.throw();
            }
        }
        this.throw();
    }

    parseObject() {
        let ret = {};
        this.skipWhitespaces();
        if (this.char() != '{') {
            this.throw();
        }
        this.position++;
        this.skipWhitespaces();
        if (this.char() == '}') {
            this.position++;
            return ret;
        }
        this.readKeyValue(ret);
        while (this.position < this.text.length) {
            this.skipWhitespaces();
            if (this.char() == '}') {
                this.position++;
                return ret;
            } else if (this.char() == ',') {
                this.position++;
                this.skipWhitespaces();
                this.readKeyValue(ret);
            } else {
                this.throw();
            }
        }
        this.throw();
    }

    readKeyValue(obj) {
        this.skipWhitespaces();
        const key = this.parseString();
        this.skipWhitespaces();
        if (this.char() != ':')
            this.throw();
        this.position++;
        this.skipWhitespaces();
        const value = this.parseItem();
        obj[key] = value;
    }
}
