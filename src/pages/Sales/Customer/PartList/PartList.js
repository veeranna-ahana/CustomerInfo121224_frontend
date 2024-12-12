import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Row,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";

// import BreadcrumbsComponent from "../../components/BreadCumbsComponent";

//getCustomers, bompartsCustomer, assyPartCustomer, assyInsertPartCustomer,
const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function PartList() {
  let navigate = useNavigate();
  // const isFirstClickRef = useRef(true);
  const [custarray, setCustArray] = useState([]);
  const [selectedCust, setSelectedCust] = useState({});
  const [custcode, setCustCode] = useState("");
  //  const [custName, setCustName] = useState("");
  const [custbomparts, setCustBomParts] = useState([]);

  const [custassydetails, setCustAssyDetails] = useState([]);

  const [selectedCustAssy, setSelectedCustAssy] = useState({});

  const [custpartdetails, setCustPartDetails] = useState([]);
  let [selectedAssyCustId, setSelectedAssyCustId] = useState("");

  let [formpartid, setFormPartId] = useState("");
  let [formpartdesc, setFormPartDesc] = useState("");
  let [formcustpartid, setFormCustPartId] = useState("");
  // let [formcustpartdesc, setFormCustPartDesc] = useState("");

  let [assmpartid, setAssmPartId] = useState("");
  let [assmid, setAssmId] = useState("");
  let [selectedPartId, setSelectedPartId] = useState("");
  let [btnaddnew, setBtnAddNew] = useState(false);
  let [btnupdate, setBtnUpdate] = useState(true);
  let [btnasmprtnew, setBtnAsmPrtNew] = useState(false);
  let [btnasmprtdel, setBtnAsmPrtDel] = useState(true);

  // let [formdescription,setFormDescription] = useState("");
  // let [formmtrlcost, setFormMtrlCost] = useState("");
  // let [formjwcost, setFormJwCost] = useState("");
  // let [status, setStatus] = useState("");
  let [qty, setQty] = useState("");
  let [mtrlcost, setMtrlcost] = useState("");
  let [lbrcost, setLbrcost] = useState("");
  let [Statusss, setStatusss] = useState("");
  let [selectedbompart, setSelectedbompart] = useState([]);
  // let [selectedbomassyid, setSelectedbomassyid] = useState("");
  // setFormMtrlCost("");
  // setStatus("** Select ***");

  let [opearion, setOpearion] = useState("");
  let [material, setMaterial] = useState("");
  const [procdata, setProcdata] = useState([]);
  const [mtrldata, setMtrldata] = useState([]);
  let [strmtrlcode, setStrMtrlCode] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setBtnAddNew(false);
    setBtnUpdate(true);
    setBtnAsmPrtNew(true);
    setBtnAsmPrtDel(true);
    async function getCustomersData() {
      postRequest(endpoints.getCustomers, {}, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].label = data[i].Cust_name;
        }
        setCustArray(data);
      });
    }
    getCustomersData();
    getRequest(endpoints.getProcessLists, (pdata) => {
      let arr = [];
      for (let i = 0; i < pdata.length; i++) {
        pdata[i].label = pdata[i].ProcessDescription;
        arr.push(pdata[i]);
      }

      setProcdata(arr);

      // //console.log("pdata", pdata);
    });
    getRequest(endpoints.getMaterials, (mtrldata) => {
      //////console.log(mtrldata);
      let arr = [];
      for (let i = 0; i < mtrldata.length; i++) {
        mtrldata[i].label = mtrldata[i].Mtrl_Code;
        arr.push(mtrldata[i]);
      }

      setMtrldata(arr);
    });
  }, []);

  // const handleCustChange = async (e) => {
  //     const cust = custarray.find((cust) => cust["Cust_Code"] === e.target.value);
  //     console.log(cust);
  //     setSelectedCust(cust);
  //     postRequest(endpoints.assyPartCustomer, { custcode: cust["Cust_Code"] }, (data) => {
  //         // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {
  //         if (data.length > 0) {
  //             setCustAssyDetails(data);
  //         } else {
  //             setCustAssyDetails([]);
  //         }
  //     });
  // };

  let handleCustChange = async (evt) => {
    // let custdet = evt.target.value.replace(/[^A-Za-z0-9. ]/gi, "");
    // if ((custdet.includes("..")) || (custdet == null) || (custdet == "")) {
    //     alert('Please enter Customer Name ..');
    //     return;
    // }

    // let cdet = custdet.substring(0, 4)
    // console.log(cdet);
    // setCustCode(custdet.substring(0, 4));
    // console.log("cust data = ", evt);
    // console.log("cust code = ", evt[0].Cust_Code);
    // console.log("table customer = ", custarray);
    const cust = custarray.find(
      (cust) => cust["Cust_Code"] === evt[0].Cust_Code
    ); // custdet.substring(0, 4));
    console.log(cust);
    setSelectedCust(cust);
    setCustCode(cust["Cust_Code"]);

    clearAssydata();
    clearcustBOM();

    postRequest(
      endpoints.getCustBOMParts,
      { custcode: evt[0].Cust_Code },
      (partsdata) => {
        console.log(partsdata);
        if (partsdata.length > 0) {
          setCustBomParts(partsdata);
        } else {
          setCustBomParts([]);
        }
      }
    );
    postRequest(
      endpoints.assyPartCustomer,
      { custcode: evt[0].Cust_Code },
      (data) => {
        // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {

        if (data.length > 0) {
          setCustAssyDetails(data);
        } else {
          setCustAssyDetails([]);
        }
      }
    );
    // postRequest(endpoints.custbomAssemblyParts, { custcode: evt.target.value }, (data) => {
    //     bompartsCustomer({ custcode: cust["Cust_Code"] }, (data) => {
    //     if (data.length > 0) {
    //         console.log(data)
    //         setCustPartDetails(data);
    //     } else {
    //         setCustPartDetails([]);
    //     }
    // });

    postRequest(
      endpoints.getCustBOMParts,
      { custcode: cust["Cust_Code"] },
      (partsdata) => {
        console.log(partsdata);
        if (partsdata.length > 0) {
          setCustBomParts(partsdata);
        } else {
          setCustBomParts([]);
        }
      }
    );
    // postRequest(endpoints.assyPartCustomer, { custcode: cust["Cust_Code"] }, (data) => {
    //     // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {
    //     if (data.length > 0) {
    //         setCustAssyDetails(data);
    //     } else {
    //         setCustAssyDetails([]);
    //     }
    // });
    postRequest(
      endpoints.custbomAssemblyParts,
      { custcode: cust["Cust_Code"] },
      (data) => {
        // bompartsCustomer({ custcode: cust["Cust_Code"] }, (data) => {
        if (data.length > 0) {
          console.log(data);
          setCustPartDetails(data);
        } else {
          setCustPartDetails([]);
        }
      }
    );
  };

  const addBOMPart = async (e) => {
    e.preventDefault();
    let partid = e.target.elements.formpartid.value;
    let partdesc = e.target.elements.formpartdesc.value;
    if (!partid || !partdesc) {
      toast.error("Please enter part id and description");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    if (!selectedCust["Cust_name"]) {
      toast.error("Please select a customer");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }

    postRequest(
      endpoints.saveCustBOMParts,
      {
        partid: partid,
        partdescription: partdesc,
        custcode: selectedCust["Cust_Code"],
      },
      (response) => {
        if (response.status === "Success") {
          setCustBomParts((olddata) => [
            ...olddata,
            {
              partid: partid,
              partdesc: partdesc,
              magodpartid: response["MagodPartId"],
            },
          ]);
          toast.success("Added PartId Successfully..");

          // if (isFirstClickRef.current) {
          //   isFirstClickRef.current = false;
          // }

          clearcustBOM();
          postRequest(
            endpoints.getCustBOMParts,
            { custcode: selectedCust["Cust_Code"] },
            (partsdata) => {
              console.log(partsdata);
              if (partsdata.length > 0) {
                setCustBomParts(partsdata);
              } else {
                setCustBomParts([]);
              }
              clearcustBOM();
            }
          );
        } else {
          toast.error("Duplicate Part Id for this Customer..");

          // if (isFirstClickRef.current) {
          //   isFirstClickRef.current = false;
          // }

          return;
        }
        clearcustBOM();
      }
    );
    clearcustBOM();
    console.log(custbomparts);
  };

  function clearcustBOM() {
    setFormPartId("");
    setFormPartDesc("");
  }

  function clearAssydata() {
    document.getElementById("formmagodid").value = "";
    document.getElementById("formassyid").value = "";
    document.getElementById("formdescription").value = "";
    document.getElementById("formstatus").value = "";
    document.getElementById("formmtrlcost").value = "";
    document.getElementById("formjwcost").value = "";
  }

  const addAssemblyDetails = async (e) => {
    e.preventDefault();
    console.log(e.target.elements.formstatus.value);
    let assyid = e.target.elements.formassyid.value;
    let formdescription = e.target.elements.formdescription.value;
    let assmstatus = e.target.elements.formstatus.value;
    let formmtrlcost = e.target.elements.formmtrlcost.value;
    let formjwcost = e.target.elements.formjwcost.value;
    let oprtion = e.target.elements.formoperation.value;
    let mtrl = strmtrlcode;
    // setCustAssyDetails((custassydetails => [custassydetails,{"MagodCode": resp["magodassmid"], "AssyCust_PartId": assyid, "AssyDescription": formdescription, "MtrlCost": formmtrlcost, "JobWorkCost": formjwcost, assystatus: assmstatus}]));
    setBtnAsmPrtNew(false);
    setBtnAsmPrtDel(true);

    clearcustAssydata(e);
    if (!selectedCust["Cust_name"]) {
      toast.error("Please select a customer");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    postRequest(
      endpoints.chkAssyDupl,
      { custcode: selectedCust["Cust_Code"], partid: assyid },
      (data) => {
        if (data.status == "Duplicate") {
          // toast.error("PartId Already Exists for selected Customer");
          return;
        } else {
          postRequest(
            endpoints.assyInsertPartCustomer,
            {
              custcode: selectedCust["Cust_Code"],
              partid: assyid,
              partdescription: formdescription,
              mtrlcost: formmtrlcost,
              jwcost: formjwcost,
              Operation: oprtion,
              Material: mtrl,
              assystatus: "Edit",
            },
            (resp) => {
              console.log(resp);
              setCustAssyDetails((olddata) => [
                ...olddata,
                {
                  MagodCode: resp["magodassmid"],
                  AssyCust_PartId: assyid,
                  AssyDescription: formdescription,
                  MtrlCost: formmtrlcost,
                  JobWorkCost: formjwcost,
                  assystatus: assmstatus,
                  Operation: oprtion,
                  Material: mtrl,
                },
              ]);
            }
          );
          toast.success("Assembly added successfully");
        }
      }
    );
  };

  const clearcustAssydata = (e) => {
    setBtnAddNew(false);
    setBtnUpdate(true);
    console.log("Clearing Assy Data ");
    e.target.elements.formassyid.value = "";
    e.target.elements.formdescription.value = "";
    e.target.elements.formstatus.value = "";
    e.target.elements.formmtrlcost.value = "";
    e.target.elements.formjwcost.value = "";
    e.target.elements.formoperation.value = "";
    setStrMtrlCode(" ");
  };

  const addCustPart = async (e) => {
    // debugger;
    e.preventDefault();
    setBtnAsmPrtDel(true);
    setBtnAsmPrtNew(false);
    if (!selectedCustAssy["AssyCust_PartId"]) {
      toast.error("Please select an assembly");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    let selcustassy = selectedCustAssy["AssyCust_PartId"];
    // console.log(selectedCust["Cust_Code"])
    // console.log(formcustpartid);
    let partid = formcustpartid;
    let qty = e.target.elements.formqty.value;
    if (!partid || !qty) {
      toast.error("Please enter part id and qty");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    if (!selectedCust["Cust_name"]) {
      toast.error("Please select a customer");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    let partdesc = custbomparts.find((part) => part["PartId"] === partid)[
      "PartDescription"
    ];

    // console.log("ENTERING INTO toCheckBomParts");

    // toCheck BOM parts

    for (let i = 0; i < custpartdetails.length; i++) {
      if (custpartdetails[i].partid === partid) {
        toast.error("Duplicate Part Id.. Please check..");

        return;
      }
    }

    // await postRequest(
    //   endpoints.toCheckBomParts,
    //   {
    //     custcode: selectedCust["Cust_Code"],
    //     assyPartId: selcustassy,
    //     partid: partid,
    //   },
    //   (resp) => {
    //     console.log("RESPONSEE was came");
    //     console.log("RESPONSEE", resp);
    //     console.log("RESPONSEE", resp.status);
    //     if (resp.status === "Duplicates") {
    //       console.log("Duplicate partid");
    //       toast.error("This partId is already used in another assembly.");
    //     } else {
    //       console.log(" No Duplicates present");
    //       toast.success("Part added successfully");
    //       if (partid !== null || partid !== "") {
    //         setCustPartDetails((olddata) => [
    //           ...olddata,
    //           {
    //             assyPartId: selcustassy,
    //             partid: partid,
    //             partdesc: partdesc,
    //             qty: qty,
    //           },
    //         ]);

    //         console.log(custpartdetails);
    //       }
    //     }
    //   }
    // );

    // const CheckBom = () => {
    // for (let i = 0; i < checkbom.length; i++) {
    //   console.log(checkbom[i].PartId);
    //   if (checkbom[i].PartId === partid) {
    //     console.log(
    //       "This part is used alrady in other assemly , please chose other"
    //     );
    //     toast.error(
    //       "This part is used alrady in other assemly , please chose other"
    //     );
    //     return;
    //   }
    // }
    // };
    // CheckBom();

    // if (custpartdetails.find((part) => part["assyPartId"] === selectedCustAssy["AssyCust_PartId"])) {
    //     alert("Part already added");
    //     return;
    // }
    toast.success("Part added successfully");
    console.log("Part id : " + partid);
    // debugger;
    if (partid !== null || partid !== "") {
      //setCustPartDetails((olddata => [...olddata, { assyPartId: selectedCustAssy["AssyCust_PartId"], partid: partid, partdesc: partdesc, qty: qty }]));
      setCustPartDetails((olddata) => [
        ...olddata,
        {
          assyPartId: selcustassy,
          partid: partid,
          partdesc: partdesc,
          qty: qty,
        },
      ]);
    }
  };

  //Sorting BOM Item List
  const [sortConfigbomitemlist, setsortConfigbomitemlist] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortBomItemList = (key) => {
    let direction = "asc";
    if (sortConfigbomitemlist.key === key && sortConfigbomitemlist.direction === "asc") {
      direction = "desc";
    }
    setsortConfigbomitemlist({ key, direction });
  };

  const sortedDatabomItemList = () => {
    const dataCopybomItemList = [...custbomparts];

    if (sortConfigbomitemlist.key) {
      dataCopybomItemList.sort((a, b) => {
        let valueA = a[sortConfigbomitemlist.key];
        let valueB = b[sortConfigbomitemlist.key];

        // Convert only for the "integer" columns
        // if (
        //   sortConfigbomitemlist.key === "QtyToNest" ||
        //   sortConfigtaskprtDets.key === "QtyNested" ||
        //   sortConfigtaskprtDets.key === "QtyProduced" ||
        //   sortConfigtaskprtDets.key === "QtyCleared"
        // ) {
        //   valueA = parseFloat(valueA);
        //   valueB = parseFloat(valueB);
        // }

        if (valueA < valueB) {
          return sortConfigbomitemlist.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigbomitemlist.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopybomItemList;
  };

  let renderBomItemList = (part) => {
    return (
      <tr className="">
        <td>{part["MagodPartId"]}</td>
        <td>{part["PartId"]}</td>
        <td>{part["PartDescription"]}</td>
      </tr>
    );
  };

  // Sorting Assembly List
  const [sortConfigAssypart, setsortConfigAssmpart] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortAssypart = (key) => {
    let direction = "asc";
    if (sortConfigAssypart.key === key && sortConfigAssypart.direction === "asc") {
      direction = "desc";
    }
    setsortConfigAssmpart({ key, direction });
  };

  const sortedDataAssyPart = () => {
    const dataCopyAssypart = [...custassydetails];

    if (sortConfigAssypart.key) {
      dataCopyAssypart.sort((a, b) => {
        let valueA = a[sortConfigAssypart.key];
        let valueB = b[sortConfigAssypart.key];

        // Convert only for the "integer" columns
        if (
          sortConfigAssypart.key === "MtrlCost" ||
          sortConfigAssypart.key === "JobWorkCost"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigAssypart.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigAssypart.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyAssypart;
  };

  let renderassemblydetails = (assmpart, id) => {
    return (
      <tr
        className=""
        style={{
          backgroundColor: selectedAssyCustId === id ? "#98A8F8" : "",
          // fontFamily: "Roboto",
          // fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => selectAssemblyPart(assmpart, id)}
      >
        <td>{assmpart["MagodCode"]}</td>
        <td>{assmpart["AssyCust_PartId"]}</td>
        <td>{assmpart["AssyDescription"]}</td>
        <td>{assmpart["MtrlCost"]}</td>
        <td>{assmpart["JobWorkCost"]}</td>
        <td>{assmpart["Operation"]}</td>
        <td>{assmpart["Material"]}</td>
        <td hidden>{assmpart["Status"]}</td>
      </tr>
    );
  };


  // Sorting Assembly List
  const [sortConfigCustpart, setsortConfigCustpart] = useState({ key: null, direction: null });

  // sorting function for table headings of the table
  const requestSortCustpart = (key) => {
    let direction = "asc";
    if (sortConfigCustpart.key === key && sortConfigCustpart.direction === "asc") {
      direction = "desc";
    }
    setsortConfigCustpart({ key, direction });
  };

  const sortedDataCustPart = () => {
    const dataCopyCustpart = [...custpartdetails];

    if (sortConfigCustpart.key) {
      dataCopyCustpart.sort((a, b) => {
        let valueA = a[sortConfigCustpart.key];
        let valueB = b[sortConfigCustpart.key];

        // Convert only for the "integer" columns
        if (
          sortConfigCustpart.key === "qty"
        ) {
          valueA = parseFloat(valueA);
          valueB = parseFloat(valueB);
        }

        if (valueA < valueB) {
          return sortConfigCustpart.direction === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfigCustpart.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataCopyCustpart;
  };

  // RENDER BOM TABLEDATA
  let rendercustpartdetail = (custpart, id) => {

    let custpartid = custpart["partid"];

    // write if condetion to remove the default assypartidissue
    if (custpartid === null) {
    } else {
      console.log("Id:"+ id +" Cust:"+custcode+" custpartid: " + custpartid+ " assyPartId: "+ custpart.assyPartId);

     // btnasmprtdel
     // setBtnAsmPrtDel(true);
      return (
        <tr
          className=""
          style={{
            backgroundColor: selectedPartId === id ? "#98A8F8" : "",
            overflowY: "scroll",
            cursor: "pointer",
          }}
          id={id}
          onClick={() => selectItem(custpart, id)}
        >
          <td>{custpart["assyPartId"]}</td>
          <td>{custpart["partid"]}</td>
          <td>{custpart["partdesc"]}</td>
          <td>{custpart["qty"]}</td>
        </tr>
      );
    }
  };

  let selectedPart = (e) => {
    setFormCustPartId(e.target.value);
  };

  let selectAssemblyPart = (part, id) => {
    console.log("entering into onclick assy");
    setBtnAddNew(true);
    setBtnUpdate(false);
    setBtnAsmPrtDel(true);
    setBtnAsmPrtNew(false);
    setSelectedAssyCustId(id);
    document.getElementById("formmagodid").value = part["MagodCode"];
    document.getElementById("formassyid").value = part["AssyCust_PartId"];
    document.getElementById("formdescription").value = part["AssyDescription"];
    document.getElementById("formmtrlcost").value = part["MtrlCost"];
    document.getElementById("formjwcost").value = part["JobWorkCost"];
    document.getElementById("formoperation").value = part["Operation"];
    console.log("id: ",id);
    // document.getElementById("formmtrl").value = part["Material"];
    // new code
    const materialOption = { Mtrl_Code: part["Material"] }; // Assuming material uses Mtrl_Code
    setSelectedItems([materialOption]); // Update typeahead selection with the material
    setStrMtrlCode(part["Material"]); // Set material code in the state

    document.getElementById("formstatus").value = "Create"; // part["Status"];

   // console.log(part["Status"]);
    setStatusss(part["Status"]);
    console.log(part);
    setSelectedCustAssy(part);
    console.log(part["AssyCust_PartId"]);
    console.log(part["MtrlCost"]);
    console.log(part["JobWorkCost"]);
    let cstasmid = part["AssyCust_PartId"];
    postRequest(
      endpoints.custbomAssemblyParts,
      {
        custcode: selectedCust["Cust_Code"],
        custassyid: cstasmid, // part["AssyCust_PartId"],
      },
      (resp) => {
        console.log("custbomassemblyParts : " + resp.length);
        console.log("response", resp);
        //    if(resp.length > 0) {
        //         if(resp.partid != null){

        setCustPartDetails(resp);
        //     }

        //     console.log(custPartDetails)
        // }
      }
    );
  };

 // console.log("Statusss", Statusss);

  const updateAssembly = () => {
    console.log("entering into updateassy");
    setBtnAddNew(false);
    setBtnUpdate(false);
    let mmagodid = document.getElementById("formmagodid").value;
    let massyid = document.getElementById("formassyid").value;
    let assmstatus = document.getElementById("formstatus").value;
    let assmdesc = document.getElementById("formdescription").value;
    let mtrlcost = document.getElementById("formmtrlcost").value;
    let jobworkcost = document.getElementById("formjwcost").value;
    let Operation = document.getElementById("formoperation").value;
    let mtrl = strmtrlcode;
   // let mtrl = material;

    postRequest(
      endpoints.UpdateBOMAssembly,
      { mmagodid, massyid, assmstatus, assmdesc, mtrlcost, jobworkcost, Operation, mtrl },
      (resp) => {
        console.log(resp);
        if (resp.status === "success") {
          // if (isFirstClickRef.current) {
          toast.success("Updated Assembly Details Successfully");
          //   isFirstClickRef.current = false;
          // }
          setCustAssyDetails(resp.data)
        }
      }
    );
  };

  let saveBomAssemblyParts = async () => {
    setBtnAddNew(false);
    setBtnUpdate(true);
    console.log("saveBomAssemblyParts");
    console.log(custpartdetails);
    postRequest(
      endpoints.bomAssemblyParts,
      { custcode: selectedCust["Cust_Code"], dataarray: custpartdetails },
      (resp) => {
        //  bomAssemblyParts({

        //  }, (resp) => {
        if (resp.status === "success") {
          // if (isFirstClickRef.current) {
          toast.success("Bom Assembly Parts saved successfully");
          //   isFirstClickRef.current = false;
          // }

          //    window.location.reload();
        }
        //       console.log(resp);
      }
    );
  };

  let selectItem = (item, id) => {
    console.log("item: ",item)
    console.log("id: "+id)
    setSelectedbompart(item);
    // console.log(item);
    setBtnAsmPrtDel(false);
    setBtnAsmPrtNew(true);
    setSelectedPartId(id);
    setAssmPartId(item.partid);
    setAssmId(item.assyPartId);
    // setStatus();
  };

  // let deleteassmparts = async () => {
  //   console.log("deleteassmparts");
  //   setBtnAsmPrtDel(true);
  //   setBtnAsmPrtNew(false);
  //   if (isFirstClickRef.current) {
  //     toast.success("Deleted successfully");
  //     isFirstClickRef.current = false;

  //     console.log("custpartsdetails", custpartdetails);
  //     let olddata = custpartdetails;
  //     let newdata = olddata.filter(
  //       (data) => data.assyid !== assmid && data.partid != assmpartid
  //     );
  //     setCustPartDetails(newdata);
  //     postRequest(
  //       endpoints.DeleteBOMAssemblyPart,
  //       { assmid, assmpartid },
  //       (deldata) => {
  //         if (deldata.status == "success") {
  //           console.log("Delete Success");
  //         }
  //       }
  //     );
  //   }
  // };

  // new solution to partid delete issue
  let deleteassmparts = async (custpart) => {
    console.log("custpartid", custpart.partid);
    console.log("custassyid", custpart.assyPartId);

    // debugger;
    setBtnAsmPrtDel(true);
    setBtnAsmPrtNew(false);
    let olddata = custpartdetails;
    let newdata = olddata.filter(
      (data) => data.assyid !== assmid && data.partid != assmpartid
    );
   // console.log(olddata);
    //console.log(newdata);
    setCustPartDetails(newdata);
    postRequest(
      endpoints.DeleteBOMAssemblyPart,{selectedbompart, custcode},
    //  { olddata, newdata },
      (deldata) => {
        if (deldata.status == "success") {
          toast.success("Part Deleted Successfully");
          console.log("Delete Success");
        }
      }
    );
  };

  let handleChangeQtyNumeric = (evt) => {
    console.log("evt.target.value", evt.target.value);
    const mvalue = evt.target.value.replace(/[^0-9]/gi, "");
    console.log("mvalve", mvalue);
    setQty(mvalue);
  };

  const handleChangeMtrlCost = (e) => {
    //  const mvalue = e.target.value.replace(/[^0-9]/gi, "");
    const { value } = e.target;
    if (/^\d*$/.test(value)) { // Only allow numeric values setValue(value); }
      setMtrlcost(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  let handleChangeLbrCost = (e) => {
    const Inputvalue = e.target.value.replace(/[^0-9]/gi, "");
    console.log("mvalve", Inputvalue);
    setLbrcost(Inputvalue);
  };

  let handleChangeOpearion = (evt) => {
    const mvalue = evt.target.value;
    console.log("mvalve", mvalue);
    setOpearion(mvalue);
  };
  let handleChangeMaterial = (evt) => {
    const mvalue = evt.target.value;
    console.log("mvalve", mvalue);
    setMaterial(mvalue);
  };
  const handleMtrlCodeTypeaheadChangeeee = (selectedOptions) => {
    console.log("selectedOptions....", selectedOptions);
    setSelectedItems(selectedOptions);
    // if (selectedOptions.length > 0) {
    //   setLastSlctedRow(selectedOptions[0]);
    // }
    setMaterial(selectedOptions[0]?.Mtrl_Code);

    console.log("selectedOptions[0]?.Mtrl_Code", selectedOptions[0]?.Mtrl_Code);
    const selectedValue =
      selectedOptions.length > 0 ? selectedOptions[0]?.Mtrl_Code : " ";
    console.log("selectedValue", selectedValue);
    setStrMtrlCode(selectedValue);
  };


  let handleKeyDown = (evt) => {

    // Prevent entering the letter "e" (101 or 69 in key codes)
    if (evt.key === "e" || evt.keyCode === 101 || evt.keyCode === 69) {
      evt.preventDefault();
    }
    // Allow decimals for two digits only
    const value = evt.target.value;
    const decimalIndex = value.indexOf(".");
    if (decimalIndex !== -1 && value.substring(decimalIndex + 1).length >= 2) {
      evt.preventDefault();
    }
  };

  return (
    // <Container>
    //     <div className="addquotecard">
    //         {/* <Row className="justify-content-md-center"> */}
    //         <h4 className="addquotecard-header">Customer BOM</h4>
    <div>
      {/* <BreadcrumbsComponent /> */}
      <h4 className="title">Customer BOM</h4>

      <div className="form-style"></div>
      <div className="row">
        <div className="col-md-6 d-flex" style={{ gap: "10px" }}>
          <label className="form-label">
            Customer
            <span
              style={{
                color: "#f20707",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              *
            </span>
          </label>

          {/* <Form.Select
              aria-label="Select Customer"
              onChange={(e) => {
                handleCustChange(e);
              }}
            >
              <option selected disabled>
                Select Customer
              </option>
              {custarray.length > 0
                ? custarray.map((cust) => {
                    return (
                      <option value={cust["Cust_Code"]}>
                        {cust["Cust_name"]}
                      </option>
                    );
                  })
                : null}
            </Form.Select> */}
          <Typeahead
            className="ip-select mt-1"
            // id="formCustName"
            id="formCustName"
            // onChange={selectCust}
            options={custarray}
            placeholder="Select Customer"
            // selected={selected}
            /*onInputChange={(label) => {
                  console.log("input change :", label);
                }}
                onChange={(label) => {
                  console.log("onchange :", label);
                }}*/
            onChange={(label) => handleCustChange(label)}
          />
        </div>
        <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
          <label className="form-label mt-1">Code </label>
          <input
            className="in-field mt-1"
            id="formCustCode"
            disabled
            value={custcode}
          />
        </div>
        <div className="col-md-3">
          <div>
            <button
              className="button-style"
              id="btnclose"
              type="submit"
              onClick={() => navigate("/customer")}
            >
              Close{" "}
            </button>
          </div>
        </div>
      </div>
      <Row>
        <Tabs defaultActiveKey="bomitemslist" className="mb-1  tab_font">
          <Tab eventKey="bomitemslist" title="Customer BOM Items List">
            <div className="row">
              <div
                className="col-md-8"
                style={{ overflowY: "scroll", height: "200px" }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      <th onClick={() => requestSortBomItemList("MagodPartId")}>Magod Part ID</th>
                      <th onClick={() => requestSortBomItemList("PartId")}>Part ID</th>
                      <th onClick={() => requestSortBomItemList("PartDescription")}>Part Description</th>
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {/* {custbomparts != null
                      ? custbomparts.map((part) => renderBomItemList(part))
                      : null} */}
                    {sortedDatabomItemList().map((part) => renderBomItemList(part))}
                  </tbody>
                </Table>
              </div>
              <div className="col-md-4" style={{ backgroundColor: "#e6e6e6" }}>
                <Form onSubmit={addBOMPart} autoComplete="off">
                  <h6 className="mb-3" style={{ textAlign: "center" }}>
                    <u>Part as identified in Customer Drawing</u>
                  </h6>
                  <div className="d-flex" style={{ gap: "60px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Part ID
                      <span
                        style={{
                          color: "#f20707",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        *
                      </span>
                    </label>

                    <input
                      id="formpartid"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Part ID"
                      required
                    />
                  </div>

                  <div className="d-flex" style={{ gap: "10px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Part Description
                      <span
                        style={{
                          color: "#f20707",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        *
                      </span>
                    </label>

                    <input
                      id="formpartdesc"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Part Description"
                      required
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <button
                      variant="primary"
                      type="submit"
                      className="button-style justify-content-center"
                    >
                      Add Part
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </Tab>

          <Tab eventKey="custpartassmlist" title="Customer Assembly List">
            <div className="row">
              <div
                className="col-md-8"
                style={{ maxHeight: "275px", overflowY: "scroll" }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      <th onClick={() => requestSortAssypart("MagodCode")}>Magod Code</th>
                      <th onClick={() => requestSortAssypart("AssyCust_PartId")}>Assm Cust PartID</th>
                      <th onClick={() => requestSortAssypart("AssyDescription")}>Assm Description</th>
                      <th onClick={() => requestSortAssypart("MtrlCost")}>Mtrl Cost</th>
                      <th onClick={() => requestSortAssypart("JobWorkCost")}>JW Cost</th>
                      <th onClick={() => requestSortAssypart("Operation")}>Operation</th>
                      <th onClick={() => requestSortAssypart("Mtrl_Code")}>Material</th>
                      {/* {[
                        "Magod Code",
                        "Assm Cust PartID",
                        "Assm Description",
                        "Mtrl Cost",
                        "JW Cost",
                      ].map((item) => {
                        return <th>{item}</th>;
                      })} */}
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {/* {custassydetails != null
                      ? custassydetails.map((part, id) =>
                        renderassemblydetails(part, id)
                      )
                      : null} */}
                    {sortedDataAssyPart().map((part, id) => renderassemblydetails(part, id))}
                  </tbody>
                </Table>
              </div>
              <div className="col-md-4" style={{ backgroundColor: "#e6e6e6" }}>
                <Form onSubmit={addAssemblyDetails} autoComplete="off">
                  <h6 className="" style={{ textAlign: "center" }}>
                    <u>Part / Assembly Details</u>
                  </h6>
                  <div className="d-flex" style={{ gap: "30px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Magod ID
                    </label>
                    <input
                      id="formmagodid"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Magod ID"
                      disabled
                      style={{ marginTop: "-5px" }}
                    />
                  </div>

                  <div className="d-flex" style={{ gap: "10px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap", marginTop: "-5px" }}
                    >
                      Assembly ID
                      <span
                        style={{
                          color: "#f20707",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        *
                      </span>
                    </label>

                    <input
                      id="formassyid"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Assembly ID"
                      required
                    />
                  </div>

                  <div className="d-flex" style={{ gap: "15px" }}>
                    <label className="form-label" style={{ marginTop: "-5px" }}>
                      Description
                      <span
                        style={{
                          color: "#f20707",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        *
                      </span>
                    </label>

                    <input
                      id="formdescription"
                      className="in-fields"
                      as="textarea"
                      type="text"
                      placeholder="Enter Description"
                    />
                  </div>

                  <div className="d-flex" style={{ gap: "45px" }}>
                    <label className="form-label" style={{ marginTop: "-5px" }}>
                      Status
                      <span
                        style={{
                          color: "#f20707",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        *
                      </span>
                    </label>

                    <select
                      className="ip-select dropdown-field"
                      id="formstatus"
                      aria-label="Select Status"
                      // value={Statusss}
                      defaultValue={Statusss}
                      style={{ marginTop: "-1px" }}
                    >
                      <option selected>Select Status</option>
                      {["Create", "Edit", "Locked", "Closed"].map((st) => {
                        return <option value={st}>{st}</option>;
                      })}
                    </select>
                  </div>

                  <div className="d-flex" style={{ gap: "35px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Mtrl Cost
                    </label>
                    <input
                      id="formmtrlcost"
                      className="in-fields"
                      type="number"
                      onKeyPress={handleKeyPress}

                      onChange={handleChangeMtrlCost}
                      // value={mtrlcost}
                      defaultValue={mtrlcost}
                      placeholder="Enter Mtrl Cost"
                    />
                  </div>
                  <div className="d-flex" style={{ gap: "19px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Labour Cost
                    </label>
                    <input
                      id="formjwcost"
                      className="in-fields"
                      type="number"
                      onKeyPress={handleKeyPress}
                      min="0"
                      onChange={handleChangeLbrCost}
                      defaultValue={lbrcost}
                      // value={lbrcost}
                      placeholder="Enter Labour Cost"
                    />
                  </div>

                  <div
                    className="d-flex"
                    style={{ gap: "29px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}>
                      Operation
                    </label>
                    {/* <input
											id="formoperation"
											className="in-fields"
											type="text"
											placeholder="Enter Opearation"
											onChange={handleChangeOpearion}
										/> */}
                    <select
                      id="formoperation"
                      className="ip-select dropdown-field "
                      onChange={handleChangeOpearion}>
                      <option
                        value=""
                        disabled
                        selected>
                        ** Select **
                      </option>
                      {procdata.map((proc) => (
                        <option
                          key={proc["ProcessDescription"]}
                          value={proc["ProcessDescription"]}>
                          {proc["ProcessDescription"]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className="d-flex"
                    style={{ gap: "39px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}>
                      Material
                    </label>
                    {/* <input
											id="formmtrl"
											className="in-fields"
											type="text"
											placeholder="Enter Material"
											onChange={handleChangeMaterial}
										/> */}
                    {mtrldata.length > 0 || mtrldata != null ? (
                      <Typeahead
                        className="ip-select dropdown-field"
                        id="formmtrl"
                        labelKey={(option) =>
                          option.Mtrl_Code || "Unknown Material"
                        }
                        name="newSrlMaterial"
                        onChange={handleMtrlCodeTypeaheadChangeeee}
                        // onInputChange={handleInputChange}
                        // onChange={handleChange}
                        // selected={Material}
                        selected={selectedItems} // Pass selected items from state
                        options={mtrldata}
                        placeholder="Choose a Material..."
                        required></Typeahead>
                    ) : (
                      ""
                    )}
                  </div>


                  <div>
                    <div className="mb-1" style={{ marginLeft: "25px" }}>
                      <div className="" style={{ textAlign: "center" }}>
                        <button
                          className="button-style"
                          variant="primary"
                          disabled={btnaddnew}
                          type="submit"
                        >
                          Add New
                        </button>
                        <button
                          className="button-style"
                          variant="primary"
                          disabled={btnupdate}
                          onClick={() => updateAssembly()}
                        >
                          Update
                        </button>
                        <button
                          className="button-style"
                          variant="primary"
                          onClick={() => {
                            saveBomAssemblyParts();
                          }}
                        >
                          Save{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <label className="Out-standing-inv ms-2 mb-1">
                Bill of Materials (BOM)
              </label>
            </div>
            <div className="row">
              <div
                className="col-md-8"
                style={{ maxHeight: "230px", overflowY: "scroll" }}
              >
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      <th onClick={() => requestSortCustpart("assyPartId")}>Assm PartId</th>
                      <th onClick={() => requestSortCustpart("partid")}>Part ID</th>
                      <th onClick={() => requestSortCustpart("partdesc")}>Description</th>
                      <th onClick={() => requestSortCustpart("qty")}>Qty</th>
                      {/* {["Assm PartId", "Part ID", "Description", "Qty"].map(
                        (item) => {
                          return <th>{item}</th>;
                        }
                      )} */}
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {/* {custpartdetails != null
                      ? custpartdetails.map((part, id) =>
                        rendercustpartdetail(part, id)
                      )
                      : null} */}
                    {sortedDataCustPart().map((part, id) => rendercustpartdetail(part, id))}
                  </tbody>
                </Table>
              </div>
              <div className="col-md-4" style={{ backgroundColor: "#e6e6e6" }}>
                <Form onSubmit={addCustPart} autoComplete="off">
                  <h6 className="" style={{ textAlign: "center" }}>
                    <u>Part Details</u>
                  </h6>
                  <div className="d-flex" style={{ gap: "10px" }}>
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Part ID{" "}
                    </label>

                    <select
                      className="ip-select dropdown-field"
                      id="formcustpartid"
                      aria-label="Select Customer Part ID"
                      onChange={selectedPart}
                      style={{ marginTop: "-3px" }}
                    >
                      <option selected disabled>
                        Select Customer Part ID
                      </option>
                      {custbomparts.length > 0
                        ? custbomparts.map((part1) => {
                          return (
                            <option value={part1.PartId}>
                              {part1.PartId} - {part1.PartDescription}
                            </option>
                          );
                        })
                        : null}
                    </select>
                  </div>

                  <div className="d-flex" style={{ gap: "28px" }}>
                    <label className="form-label">Qty</label>
                    <input
                      className="in-fields"
                      id="formqty"
                      type="text"
                      onChange={(e) => handleChangeQtyNumeric(e)}
                      value={qty}
                      placeholder="Enter Quantity"
                      min="0"
                    />
                  </div>

                  <div className="row mt-4 mb-2 justify-content-center">
                    <div style={{ textAlign: "center" }}>
                      <button
                        className="button-style"
                        variant="primary"
                        type="submit"
                        disabled={btnasmprtnew}
                      // onClick={() => {
                      //   saveBomAssemblyParts();
                      // }}
                      >
                        Add Assm Parts
                      </button>
                      <button
                        className="button-style"
                        variant="primary"
                        disabled={btnasmprtdel}
                        onClick={deleteassmparts}
                      >
                        Delete Assm Parts
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            {/* </Container> */}
          </Tab>
        </Tabs>
      </Row>
    </div>
    // </Container>
  );
}

export default PartList;
