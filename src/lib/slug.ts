export default (s: String): String => s.replace(/\W+/g, '-').toLowerCase()
