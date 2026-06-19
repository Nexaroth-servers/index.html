body{
    margin:0;
    font-family:Arial,sans-serif;
    background:#0f172a;
    color:white;
}

nav{
    background:#020617;
    padding:15px;
    display:flex;
    justify-content:space-between;
    align-items:center;
}

nav ul{
    display:flex;
    gap:15px;
    list-style:none;
}

nav a{
    color:white;
    text-decoration:none;
}

header{
    text-align:center;
    padding:120px 20px;
    background:linear-gradient(135deg,#2563eb,#7c3aed);
}

section{
    padding:60px 20px;
}

.grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:20px;
}

.card{
    background:#1e293b;
    padding:20px;
    border-radius:10px;
}

button{
    padding:12px 25px;
    border:none;
    border-radius:8px;
    cursor:pointer;
}

input{
    width:100%;
    margin:10px 0;
    padding:12px;
}

footer{
    background:#020617;
    text-align:center;
    padding:30px;
}
