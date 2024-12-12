
import React, { Fragment, useEffect, useState } from 'react';
import { PDFDownloadLink, PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import PropTypes from 'prop-types';  // Add PropTypes for validation
import moment from 'moment';
import magodlogo from "../../../../../../images/MagodLogo.png"
import { Button } from 'react-bootstrap';
import { postRequest } from '../../../../../api/apiinstance';
// import DuesTable from "./DuesTable";
// import { postRequest } from "../../../../../api/apiinstance";
import { endpoints } from "../../../../../api/constants";

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


export default function DuesPrint({ DueReportData, UnitData, ODAmt }) {

    const [newData, setNewData] = useState([]);
    const [unitData, setUnitData] = useState([]);

    useEffect(() => {
        if (Array.isArray(DueReportData)) {  // Ensure it is an array
            setNewData(DueReportData);
        } else {
            console.error("DueReportData should be an array");
        }
        if (Array.isArray(UnitData)) {  // Ensure it is an array
            setUnitData(UnitData);
        } else {
            console.error("DueReportData should be an array");
        }

    }, [DueReportData, UnitData]);


    //useEffect(() => { pdf(<MyDocument />).toBlob().then(blob => { // Use the blob to count pages or download the PDF }); }, []);

    const handleDueGeneratePDF = async () => {
        try {
            // const response = await axios.post('/generate-pdf', { newData, unitData, CName });

            await postRequest(endpoints.getGenerateDuePdf, { ccode: newData[0].Cust_Code }, (response) => {
                console.log('Response:', response);
                //   setFilePath(response.filePath);
                alert(response.data.message);
            });
            // setFilePath(response.data.filePath);
            // alert(response.data.message);
        }
        catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const fileName = `Duelist_${getCurrentDate()}.pdf`;

    return (
        <Fragment>
            {newData.length > 0 && (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
                            <Button variant="primary" onClick={handleDueGeneratePDF} style={{ fontSize:'10px'}}>Save to Server</Button>
                            <PDFDownloadLink
                                document={<MyDocument newData={newData} unitData={unitData} ODAmt={ODAmt} />}
                                fileName={fileName} >
                                {({ loading }) => loading ? 'Loading document...' : (
                                    <Button variant="primary" style={{ fontSize:'10px'}}>Download PDF</Button>)}
                            </PDFDownloadLink>
                        </div>
                        <PDFViewer width="1200" height="600">
                            <MyDocument newData={newData} unitData={unitData} ODAmt={ODAmt} />
                        </PDFViewer>
                    </div>
                </>
            )}
        </Fragment>
    );
}


const MyDocument = ({ newData, unitData, ODAmt }) => (

    <Document>
        <Page size="A4" style={styles.page} >
            {/* <Header unitData={unitData} /> */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableCol, width: '10%' }}>
                        <Image style={styles.logo} src={magodlogo} /> {/* Update with your logo path */}
                    </View>
                    <View style={{ ...styles.tableCol, width: '90%' }}>
                        <Text style={styles.companyDetails}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>{unitData[0].RegisteredName}{'\n'}</Text>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'left', fontweight: 'bold' }}>{unitData[0].Unit_Address}{'\n'}</Text>
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.title}>List of Invoices Due For Payment as on {getCurrentDate()}</Text>

                {newData.length > 0 ? (
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColLeft}>Customer Name: </Text>
                            <Text style={styles.tableColHeaderMerge}>{newData[0].Cust_Name}</Text>
                            {/* <Text style={styles.tableColRight}>{       }</Text>
                            <Text style={styles.tableColRight}>{       }</Text> */}
                            {/* <Text style={styles.tableColRight}>{     }</Text> */}
                            <Text style={styles.tableColRight}>        Due Amount : {parseFloat(ODAmt).toFixed(2)}</Text>
                        </View>
                        <View style={styles.line} /> {/* Line above headers */}
                        <View style={{ ...styles.tableRow, fontweight: 'bold' }}>
                            <Text style={{ ...styles.tableColHeader, width: '5%' }}>Srl</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Inv No</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Inv Date</Text>
                            <Text style={{ ...styles.tableColHeader, width: '20%' }}>PO No</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Amount</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Received</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Balance</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Due Date</Text>
                            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Due Days</Text>
                        </View>
                        <View style={styles.line} /> {/* Line above headers */}
                        {newData.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={{ ...styles.tableCol, width: '5%' }}>{index + 1}</Text>
                                <Text style={{ ...styles.tableCol, width: '10%' }}>{item.Inv_No}</Text>
                                <Text style={{ ...styles.tableCol, width: '10%' }}>{item.Inv_Date}</Text>
                                <Text style={{ ...styles.tableCol, Width: '30%' }}>{item.PO_No}</Text>
                                <Text style={{ ...styles.tableColRight, width: '10%' }}>{item.InvTotal}</Text>
                                <Text style={{ ...styles.tableColRight, width: '10%' }}>{item.PymtAmtRecd}</Text>
                                <Text style={{ ...styles.tableColRight, width: '10%' }}>{item.Balance}</Text>
                                <Text style={{ ...styles.tableCol, width: '10%' }}>{moment(item.DespatchDate).add(item.creditTime, "days").format("DD-MM-YYYY")}</Text>
                                <Text style={{ ...styles.tableColRight, width: '10%' }}>{item.DueDays}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={styles.text}>No data available</Text>
                )}
            </View>
            <Footer pageNumber={1} />
        </Page>
        )
    </Document >
);

MyDocument.propTypes = {
    newData: PropTypes.array.isRequired,
    unitData: PropTypes.array.isRequired,
    ODAmt: PropTypes.string.isRequired
};


DuesPrint.propTypes = {
    DueReportData: PropTypes.array.isRequired,
    UnitData: PropTypes.array.isRequired,
    ODAmt: PropTypes.string.isRequired
};

const Header = ({ unitData, pageNumber }) => (
    <>
        <View style={styles.line} /> {/* Line above headers */}
        <View style={{ ...styles.tableRow, fontweight: 'bold' }}>
            <Text style={{ ...styles.tableColHeader, width: '5%' }}>Srl</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Inv No</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Inv Date</Text>
            <Text style={{ ...styles.tableColHeader, width: '20%' }}>PO No</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Amount</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Received</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Balance</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Due Date</Text>
            <Text style={{ ...styles.tableColHeader, width: '10%' }}>Due Days</Text>
        </View>
        <View style={styles.line} />
    </>
    // <View style={styles.header}>
    //     <Text style={styles.headerText}>{unitData[0].RegisteredName} - Page {pageNumber} </Text>
    //     <Image style={styles.logo} src={magodlogo} />
    // </View>
);
const Footer = ({ pageNumber }) => (
    <>
        <View style={styles.line} />
        {/* <View style={styles.footer}>
            <Text style={styles.footerText}>Page {pageNumber}</Text>
        </View> */}
    </>
);