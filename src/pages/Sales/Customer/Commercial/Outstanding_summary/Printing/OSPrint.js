import React, { Fragment, useEffect, useState } from 'react';
import { PDFDownloadLink, PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import PropTypes from 'prop-types';  // Add PropTypes for validation
import moment from 'moment';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import magodlogo from "../../../../../../images/MagodLogo.png"
import { postRequest } from '../../../../../api/apiinstance';
import { endpoints } from "../../../../../api/constants";

//import { postRequest } from '../../../../../api/apiinstance';
// import DuesTable from "./DuesTable";
// import { postRequest } from "../../../../../api/apiinstance";


// Define styles with fixed column widths and wrapping 
const styles = StyleSheet.create(
    {
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            padding: 20,
        },
        table: {
            display: 'table',
            width: 'auto',
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableColHeader: {
            //  border: '1px solid #000',
            //  backgroundColor: '#E4E4E4',
            fontWeight: 'bold',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '20%', // Fixed width for header columns 
        },
        tableCol: {
            //  border: '1px solid #000',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '20%', // Fixed width for data columns 
            flexWrap: 'wrap', // Enable text wrapping 
        },
        logo: {
            width: 30,
            height: 40,
        },
        companyDetails: {
            fontSize: 10, // Reduced font size 
            textAlign: 'right',
        },
        title: {
            fontSize: 12, // Reduced font size 
            marginBottom: 10,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        text: {
            fontSize: 10, // Reduced font size 
        },
        tableColRight: {
            //   border: '1px solid #000',
            padding: 5,
            fontSize: 10, // Reduced font size width: '20%', // Fixed width for data columns 
            textAlign: 'right', // Align text to the right 
            flexWrap: 'wrap', // Enable text wrapping 
        },
        tableColLeft: {
            //   border: '1px solid #000',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '20%', // Fixed width for data columns 
            textAlign: 'left', // Align text to the left 
            flexWrap: 'wrap', // Enable text wrapping 
        },
        tableColHeaderMerge: {
            border: '1px solid #000',
            //  backgroundColor: '#E4E4E4',
            fontWeight: 'bold',
            padding: 5,
            fontSize: 10, // Reduced font size 
            width: '50%', // Merged column width for header 
            textAlign: 'left', // Centered text for merged column 
        },
        line: {
            height: 1,
            backgroundColor: '#000',
            marginVertical: 3,
        },
    });


// Function to get today's date in DD/MM/YYYY format 
const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0! 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export default function OSPrint({ OSData, UnitData, CName }) {

    const [newData, setNewData] = useState([]);
    const [unitData, setUnitData] = useState([]);
    const [filePath, setFilePath] = useState('');
    const [custcode, setCustCode] = useState('');
    const [custname, setCustName] = useState('');

    useEffect(() => {
        if (Array.isArray(OSData)) {  // Ensure it is an array
            setNewData(OSData);
        } else {
            console.error("DueReportData should be an array");
        }
        if (Array.isArray(UnitData)) {  // Ensure it is an array
            setUnitData(UnitData);
        } else {
            console.error("DueReportData should be an array");
        }

        postRequest(endpoints.getCustCodeByName, { custname: CName }, (respdata) => {
            console.log("cust code : ", respdata);
            setCustCode(respdata[0].Cust_Code);
            setCustName(respdata[0].Cust_name);
        });

    }, [OSData, UnitData]);

    // setFilePath(process.env.REACT_APP_API_KEY);

    const fileName = `Outstanding_Invoices_${CName}.pdf`;
    const handleGeneratePDF = () => {
        console.log('Generating PDF...');
       // try {
            // const response = await axios.post('/generate-pdf', { newData, unitData, CName });
            postRequest(endpoints.getGenerateOSPdf, { custcode, custname }, (response) => {
                console.log('Response:', response);
              //  alert(response.message);
            });
       // }
       // catch (error) {
       //     console.error('Error generating PDF:', error);
       // }
    };

    return (
        <Fragment>
            {newData.length > 0 && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button variant="primary" onClick={handleGeneratePDF} style={{ fontSize:'10px'}}>Save to Server</Button>

                        <PDFDownloadLink
                            document={<MyDocument newData={newData} unitData={unitData} CName={CName} />}
                            fileName={fileName}
                        >
                            {({ blob, url, loading, error }) => (loading ? 'Loading document...' :
                                <Button variant="primary" style={{ fontSize:'10px'}} onClick={() => window.open(url, '_blank')}>Download PDF</Button>
                            )}
                        </PDFDownloadLink>
                    </div>
                    <PDFViewer width="1200" height="600">
                        <MyDocument newData={newData} unitData={unitData} CName={CName} />
                        {/* <MyDocument newData={newData} /> */}
                    </PDFViewer>
                </>
            )}
        </Fragment>
    );
}

const MyDocument = ({ newData, unitData, CName }) => (

    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableCol, width: '10%' }}>
                        <Image style={styles.logo} src={magodlogo} /> {/* Update with your logo path */}
                    </View> <View style={{ ...styles.tableCol, width: '90%' }}>
                        <Text style={styles.companyDetails}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>{unitData[0].RegisteredName}{'\n'}</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'left', fontweight: 'bold' }}>{unitData[0].Unit_Address}{'\n'}</Text>
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>


                {newData.length > 0 ? (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.title}>Outstanding Invoices Report For {CName}</Text>
                        </View>
                        <View style={styles.line} /> {/* Line above headers */}
                        <View style={{ ...styles.tableRow, fontweight: 'bold' }}>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Inv No</Text>
                            <Text style={{ ...styles.tableColHeader, width: '15%' }}>Inv Date</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Amount</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Received</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Balance</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Due Days</Text>
                            <Text style={{ ...styles.tableColHeader, width: '35%' }}>PO No</Text>
                        </View>
                        <View style={styles.line} /> {/* Line above headers */}
                        {newData.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={{ ...styles.tableCol, width: '10%' }}>{item.Inv_No}</Text>
                                <Text style={{ ...styles.tableCol, width: '15%' }}>{moment(item.Inv_Date).format("DD-MM-YYYY")}</Text>
                                <Text style={{ ...styles.tableColRight, width: '10%' }}>{item.GrandTotal}</Text>
                                <Text style={{ ...styles.tableColRight, width: '10%' }}>{item.PymtAmtRecd}</Text>
                                <Text style={{ ...styles.tableColRight, width: '10%' }}>{item.Due}</Text>
                                <Text style={{ ...styles.tableColRight, width: '10%' }}>{item.DueDays}</Text>
                                <Text style={{ ...styles.tableCol, Width: '35%' }}>{item.PO_No}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.text}>No data available</Text>
                )}
            </View>
        </Page>
    </Document >
);

MyDocument.propTypes = {
    newData: PropTypes.array.isRequired  // Add prop types validation
};


OSPrint.propTypes = {
    OSData: PropTypes.array.isRequired  // Add prop types validation
};
