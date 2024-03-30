export class JsonParser {
    constructor(text) {
        this.text = text;
        this.position = 0;
    }

    static parse(text) {
        const parser = new JsonParser(text);
        return parser.parseAll();
    }

    parseAll() {
        const ret = this.parseItem();
        if (this.position < this.text.length)
            this.throw();
        return ret;
    }

    throw() {
        throw new Error("Json parsing error on position " + this.position);
    }

    parseItem() {
        this.skipWhitespaces();
        if (this.text[this.position] == '[') {
            return this.parseArray();
        } else if (this.text[this.position] == '{') {
            return this.parseObject()
        } else if (this.text[this.position] == '"') {
            return this.parseString();
        } else if (/[0-9\.-]/.test(this.text[this.position])) {
            return this.parseNumber()
        } else if (this.text.substring(this.position, this.position + 4) == 'true') {
            this.position += 4;
            return true;
        } else if (this.text.substring(this.position, this.position + 5) == 'false') {
            this.position += 5;
            return false;
        } else if (this.text.substring(this.position, this.position + 4) == 'null') {
            this.position += 4;
            return null;
        } else {
            this.throw();
        }
    }

    skipWhitespaces() {
        while (this.position < this.text.length) {
            if (/\s/.test(this.text[this.position])) {
                this.position++;
            } else {
                return;
            }
        }
    }

    parseString() {
        this.skipWhitespaces();
        if (this.text[this.position] != '"') {
            this.throw();
        }
        this.position++;
        let ret = "";
        while (this.position < this.text.length) {
            if (this.text[this.position] == '"') {
                this.position++;
                return ret;
            } else if (this.text[this.position] == '\\') {
                this.position++;
                if (this.text[this.position] == '\\') {
                    this.position++;
                    ret += '\\';
                } else if (this.text[this.position] == '/') {
                    this.position++;
                    ret += '/';
                } else if (this.text[this.position] == 'r') {
                    this.position++;
                    ret += '\r'
                } else if (this.text[this.position] == 'n') {
                    this.position++;
                    ret += '\n'
                } else if (this.text[this.position] == 't') {
                    this.position++;
                    ret += '\t'
                } else if (this.text[this.position] == 'b') {
                    this.position++;
                    ret += '\b';
                } else if (this.text[this.position] == 'f') {
                    this.position++;
                    ret += '\f';
                } else if (this.text[this.position] == '"') {
                    this.position++;
                    ret += '"';
                } else if (this.text[this.position] == 'x') {
                    this.position++;
                    const charCode = parseInt('0x' + this.text.substring(this.position, this.position + 2))
                    this.position += 2;
                    ret += String.fromCharCode(charCode);

                } else if (this.text[this.position] == 'u') {
                    this.position++;
                    const charCode = parseInt('0x' + this.text.substring(this.position, this.position + 4))
                    this.position += 4;
                    ret += String.fromCharCode(charCode);

                } else {
                    this.throw();
                }
            } else {
                ret += this.text[this.position];
                this.position++;
            }
        }
        this.throw();
    }

    parseNumber() {
        let ret = "";
        if (/[-0-9]/.test(this.text[this.position])) {
            ret += this.text[this.position]
            this.position++;
        } else {
            this.throw();
        }
        while (this.position < this.text.length) {
            if (/[-+0-9e\.]/.test(this.text[this.position])) {
                ret += this.text[this.position];
                this.position++;
            } else {
                break;
            }
        }
        if (/^-?0+[0-9]/.test(ret)) {
            this.throw();
        }
        return parseFloat(ret);
    }

    parseArray() {
        const ret = [];
        this.skipWhitespaces();
        if (this.text[this.position] != '[')
            this.throw();
        this.position++;
        this.skipWhitespaces();
        if (this.text[this.position] == ']') {
            this.position++;
            return ret;
        } else {
            ret.push(this.parseItem());
        }
        while (this.position < this.text.length) {
            this.skipWhitespaces();
            if (this.text[this.position] == ']') {
                this.position++;
                return ret;
            } else if (this.text[this.position] == ',') {
                this.position++;
                this.skipWhitespaces();
                ret.push(this.parseItem());
            } else {
                this.throw();
            }
        }
    }

    parseObject() {
        const ret = {};
        this.skipWhitespaces();
        if (this.text[this.position] != '{')
            this.throw();
        this.position++;
        this.skipWhitespaces();
        if (this.text[this.position] == '}') {
            this.position++;
            return ret;
        } else {
            const key = this.parseString();
            this.skipWhitespaces();
            if (this.text[this.position] != ':')
                this.throw();
            this.position++;
            this.skipWhitespaces()
            const value = this.parseItem();
            ret[key] = value;
        }
        while (this.position < this.text.length) {
            this.skipWhitespaces();
            if (this.text[this.position] == '}') {
                this.position++;
                return ret;
            } else if (this.text[this.position] == ',') {
                this.position++;
                this.skipWhitespaces();

                const key = this.parseString();
                this.skipWhitespaces();
                if (this.text[this.position] != ':')
                    this.throw();
                this.position++;
                this.skipWhitespaces()
                const value = this.parseItem();
                ret[key] = value;
            } else {
                this.throw();
            }
        }
    }
}
