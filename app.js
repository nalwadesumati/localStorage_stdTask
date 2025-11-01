const cl = console.log;

const stdForm = document.getElementById("stdForm");
const studentContainer = document.getElementById("studentContainer");
const fnameCntrl = document.getElementById("fname");
const lnameCntrl = document.getElementById("lname");
const emailCntrl = document.getElementById("email");
const contactCntrl = document.getElementById("contact");
const submitDataBtn = document.getElementById("submitDataBtn");
const updateDataBtn = document.getElementById("updateDataBtn");

let stdArr;
if (localStorage.getItem("stdArr")) {
    stdArr = JSON.parse(localStorage.getItem("stdArr"));
} else {
    stdArr = [];
}
cl(stdArr)


const uuid = () => {
    return String("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    })
};


const createStdArr = (arr) => {
    let res = "";
    arr.forEach((std, i) => {
        res += `
      <tr id="${std.stdId}">
        <td>${i + 1}</td>
        <td>${std.fname}</td>
        <td>${std.lname}</td>
        <td>${std.email}</td>
        <td>${std.contact}</td>
        <td><i class="fa-solid fa-pen-to-square text-success" onclick="onEdit(this)"></i></td>
        <td><i class="fa-solid fa-trash text-danger" onclick="onRemove(this)"></i></td>
      </tr>`;
    });
    studentContainer.innerHTML = res;
};
createStdArr(stdArr);


let EDIT_ID;
const onEdit = (ele) => {

    EDIT_ID = ele.closest("tr").id;
    localStorage.setItem("EDIT_ID", EDIT_ID)
    cl(EDIT_ID);

    let EDIT_OBJ = stdArr.find(st => {
        return st.stdId === EDIT_ID;
    })
    cl(EDIT_OBJ);

    fnameCntrl.value = EDIT_OBJ.fname;
    lnameCntrl.value = EDIT_OBJ.lname;
    emailCntrl.value = EDIT_OBJ.email;
    contactCntrl.value = EDIT_OBJ.contact;

    updateDataBtn.classList.remove("d-none")
    submitDataBtn.classList.add("d-none");
}


const onRemove = (ele) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't this todo Item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Remove it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let REMOVE_ID = ele.closest("tr").id
            cl(REMOVE_ID);

            //ten remove object from array
            let getIndex = stdArr.findIndex(std => std.stdId === REMOVE_ID)
            cl(getIndex);
            stdArr.splice(getIndex, 1)

            //update array in localStorage
            localStorage.setItem("stdArr", JSON.stringify(stdArr));

            //remove from ui
            ele.closest("tr").remove();

            Swal.fire({
                title: "Deleted!",
                text: "Data Deleted Successfully.",
                timer: 3000,
                icon: "success"
            });
        }
    });
}



const onSubmit = eve => {
    eve.preventDefault();

    let stdObj = {
        fname: fnameCntrl.value,
        lname: lnameCntrl.value,
        email: emailCntrl.value,
        contact: contactCntrl.value,
        stdId: uuid(),
    }

    cl(stdObj)
    stdForm.reset();
    stdArr.push(stdObj);

    localStorage.setItem("stdArr", JSON.stringify(stdArr));

    let tr = document.createElement("tr");
    tr.id = stdObj.stdId;

    tr.innerHTML = `
                    <td>${stdArr.length}</td>
                    <td>${stdObj.fname}</td>
                    <td>${stdObj.lname}</td>
                    <td>${stdObj.email}</td>
                    <td>${stdObj.contact}</td>
                    <td><i onclick="onEdit(this)" class="fa-solid fa-pen-to-square text-success"></i> </td>
                    <td><i onclick="onRemove(this)" class="fa-solid fa-trash text-danger"></i>
                    </td>
                `
    studentContainer.appendChild(tr);

    Swal.fire({
        title: " DATA ADDED SUCCESSFULY!!!",
        timer: 3000,
        icon: "success"
    })
}

const onUpdate = () => {
    //update id 
    let UPDATE_ID = localStorage.getItem("EDIT_ID");
    cl(UPDATE_ID);

    let UPDATE_OBJ = {
        fname: fnameCntrl.value,
        lname: lnameCntrl.value,
        email: emailCntrl.value,
        contact: contactCntrl.value,
        stdId: UPDATE_ID
    }

    cl(UPDATE_OBJ);
    stdForm.reset();

    //update/replace in array
    let getIndex = stdArr.findIndex(std => std.stdId === UPDATE_ID)
    cl(getIndex);
    stdArr[getIndex] = UPDATE_OBJ;

    //update in localstorage
    localStorage.setItem("stdArr", JSON.stringify(stdArr));

    updateDataBtn.classList.add("d-none");
    submitDataBtn.classList.remove("d-none");


    Swal.fire({
        title: "Updeted",
        text: " Updated Successfully.",
        timer: 3000,
        icon: "success"
    });

    createStdArr(stdArr);

    localStorage.removeItem("EDIT_ID");
}



stdForm.addEventListener("submit", onSubmit);
updateDataBtn.addEventListener("click", onUpdate); 