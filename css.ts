// Css for the iframe in the LHS
export const css = `
<style>
body {
  font-family: georgia,times,serif;
  font-size: 14pt;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

table {
  width: 100%;
  border-spacing: 0;
}
li {
  list-style: none;
}
thead tr {
    background-color: #333;
    color: #eee;
}

th, td {
    padding: 8px;
}

tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

a[href] {
  text-decoration: none;
}

blockquote {
  border-left: 1px solid #333;
  margin-left: 2px;
  padding-left: 10px;
}

hr {
    margin: 1em 0 1em 0;
    text-align: center;
    border-color: #777;
    border-width: 0;
    border-style: dotted;
}

hr:after {
    content: "···";
    letter-spacing: 1em;
}

</style>
`;