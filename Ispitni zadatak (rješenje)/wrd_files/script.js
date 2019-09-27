$.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var check = false;
        return this.optional(element) || regexp.test(value);
    },
    "Please check your input."
);

$("#forma").validate({
    rules:{
        dostavaIme:{
            required:true,
            regex:/^[A-Z][a-zA-Z ]+[A-Z][a-zA-Z]+$/
        },
        dostavaAdresa:{
            required:true,
            regex:/^[a-zA-Z]+$/
        },
        dostavaTelefon:{
            required:true,
            regex:/^\+[0-9]{3}-[0-9]{2}-[0-9]{3}-[0-9]{4}$/
        }
    },
    messages:{
        dostavaIme:{
            required:"Ovo polje je obavezno",
            regex:"Morate unijeti dvije rijeci sa pocetnim velikim slovima"
        },
        dostavaAdresa:{
            required:"Ovo polje je obavezno",
            regex:"Samo textualni podaci"
        },
        dostavaTelefon:{
            required:"Ovo polje je obavezno",
            regex:"format: +111-11-111-1111"
        }
    }
    
});

function getPoziv(funk,url)
    {
        
        var zahtjev = new XMLHttpRequest();
       
        zahtjev.onload  = function() { 
                if (zahtjev.status === 200) {  
                    funk(JSON.parse(zahtjev.responseText));
                }
                else {  
                    alert("Server javlja grešku: " + zahtjev.statusText);  
                }  
        }

        zahtjev.onerror = function() {
            alert("Greška u komunikaciji sa serverom.");  
        };

        zahtjev.open("GET", url, true);
        zahtjev.send(null);
    }

    urlGetAllProizvodi='https://onlineshop.wrd.app.fit.ba/api/ispit20190829/Narudzba/GetProizvodiAll';
    

    function napraviRedove(obj)
    {
        return `<tr>
        <td>${obj.proizvodID}</td>
        <td>${obj.naziv}</td>
        <td>${obj.cjena}</td>
        <td>${obj.jedinicaMjere}</td>
        <td>${obj.likeCounter}</td>
        <td><button onclick="Lajkovi(${obj.proizvodID})">Like</button></td>
        <td><button onclick="Odaberi(${obj.proizvodID})">Odaberi</button></td>
        
        
        </tr>`
    }
    function ocistiRedove()
    {
        $("#tabelaID tbody").empty();
    }
    function ucitajPodatke(obj)
    {
        ocistiRedove();
        for(var i=0; i<obj.length; i++)
        {
            document.querySelector("#tabelaID tbody").innerHTML+=napraviRedove(obj[i]);
        }
       
    }
   
    getPoziv(ucitajPodatke,urlGetAllProizvodi);

    //Lajkovi
    function Lajkovi(obj)
    {
        zahtjev=new XMLHttpRequest;
        zahtjev.onload=function()
        {
            if(zahtjev.status==200)
            {
                var json=JSON.parse(zahtjev.responseText);
                json.likeCounter++;
                getPoziv(ucitajPodatke,urlGetAllProizvodi);
            }
        }
        urlLajkovi=`https://onlineshop.wrd.app.fit.ba/api/ispit20190829/Narudzba/Like?proizvodId=${obj}`;
        zahtjev.open('GET',urlLajkovi,true);
        zahtjev.send();
    }
    //Odabir proizovda
    function Odaberi(id)
    {
        document.getElementById("proizvodID").innerHTML=id;
    }

    //Narucivanje proizvoda

    document.getElementById("naruci").onclick=function()
    {
        obj={
            dostavaGrad:$("#dostavaGrad").val(),
            dostavaAdresa:$("#dostavaAdresa").val(),
            dostavaIme:$("#dostavaIme").val(),
            dostavaTelefon:$("#dostavaTelefon").val(),
            proizvodID:$("#proizvodID").val(),
            kolicina:$("#kolicina").val()
        };

        var json=JSON.stringify(obj);
        zahtjev=new XMLHttpRequest;
        zahtjev.onload=function()
        {
            if(zahtjev.status==200)
            {
                getPoziv(ucitajPodatke,urlGetAllProizvodi);
            }
        }
        urlDodaj='http://onlineshop.wrd.app.fit.ba/api/ispit20190829/Narudzba/Dodaj';
        zahtjev.open('POST',urlDodaj,true);
        zahtjev.setRequestHeader("Content-Type","application/json");
        zahtjev.send(json);
    }
    //UcitajNarudzbe
    function napraviRedoveNarudzbi(obj)
    {
        return `<tr>
        <td>${obj.proizvodID}</td>
        <td>${obj.naziv}</td>
        <td>${obj.cjena}</td>
        <td>${obj.kolicina}</td>
        <td>${obj.dostavaIme}</td>
        <td>${obj.dostavaAdresa}</td>
        <td>${obj.dostavaTelefon}</td>
         </tr>`
    }
    function ocistiRedoveNarudzbi()
    {
        $("#tableDesno tbody").empty();
    }
    function ucitajNarudzbe(obj)
    {
        ocistiRedoveNarudzbi();
        for(var i=0; i<obj.length; i++)
        {
            document.querySelector("#tableDesno tbody").innerHTML+=napraviRedoveNarudzbi(obj[i]);
        }
       
    }
    urlNarudzbe='https://onlineshop.wrd.app.fit.ba/api/ispit20190829/Narudzba/GetNarudzbeAll';
    getPoziv(ucitajNarudzbe,urlNarudzbe);

    //filtiranje

    document.getElementById("filtiranje2").oninput=function()
    {
        ocistiRedoveNarudzbi();
        var unos=document.getElementById("filtiranje2").value;

        var zahtjev=new XMLHttpRequest;
        zahtjev.onload=function()
        {
            if(zahtjev.status==200)
            {
                var json=JSON.parse(zahtjev.responseText);
                for(var i=0; i<json.length; i++)
                {
                    if(json[i].dostavaIme.startsWith(unos))
                    {
                        document.querySelector("#tableDesno tbody").innerHTML+=napraviRedoveNarudzbi(json[i]);
                    }
                }
            }
        }
        zahtjev.open('GET',urlNarudzbe,true);
        zahtjev.send();

    }

    