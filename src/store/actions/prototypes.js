Array.prototype.remove = function(a) {
  var idx = this.indexOf(a)
  for (var i = idx; i < this.length - 1; i++) {
    this[i] = this[i+1]
  }

  this.length -= 1
}

String.prototype.strip = function(c) {
  var i = 0,
    j = this.length - 1;
  while (this[i] === c) i++;
  while (this[j] === c) j--;
  return this.slice(i, j + 1);
}

String.prototype.count = function(c) {
  var result = 0,
    i = 0;
  for (i; i < this.length; i++)
    if (this[i] == c) result++;
  return result;
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
