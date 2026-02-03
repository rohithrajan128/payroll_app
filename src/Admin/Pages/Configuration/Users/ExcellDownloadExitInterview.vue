<template>
    <div class="main-20">
        <div flat color="white" class="row pa-0 ma-0 align-items-center">
            <div class="row d-flex" v-if="showexcell">
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <img v-on="on" class="img_align img-responsive mr-2 image ml-5 img_items" width="50px"
                            src="@/assets/images/xlsxicon.png" style="cursor: pointer" alt  @click="excelldownload()"/>
                    </template>
                    <span>{{ $t("download_excel") }}</span>
                </v-tooltip>
            </div>
        </div>
    
        <div id="hiddentableexcel_format">
      <table border="1" ref="exportable_table" id="timesheet_table">
        <thead>
          <tr>
            <th>SL No</th>
            <th>Questions</th>
            <th>Comments</th>    
        </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in questions_array" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ data.questions }}</td>
            <td>{{ data.answer }}</td>
          </tr>
        </tbody>
      </table>
      <input type="text" v-model="name" />
      <button id="downloaddummybutton" @click="ExportExcel('xlsx')">
        Export table to excel xlsx
      </button>
    </div>
    </div> 
</template>
<script>

import moment from "moment";
import ExcelJS from "exceljs";

export default {
    props:['questions','header'],
  components: {
    moment,
  },
  data: () => ({
    showexcell:false,
    questions_array : [],
    header_name : "",
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchRecruitment();
    const recaptchaScript = document.createElement("script");
    recaptchaScript.setAttribute(
      "src",
      "https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js"
    );
    document.head.appendChild(recaptchaScript);
  },
  watch: {
    questions: {
      immediate: true,
      handler() {
        if (this.questions.length>0) {
          this.questions_array = this.questions;
          this.header_name = this.header;
          this.showexcell = true;       
         }
      },
    },
  },
  methods: {
    excelldownload() {
      setTimeout(() => {
        document.getElementById("downloaddummybutton").click();
      }, 200);
    },
    ExportExcel(type, fn, dl) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(this.header_name);
      const table = this.$refs.exportable_table;
      const cellStyle = {
        font: { bold: true, color: { argb: "FFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "6c6cff" },
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
      const cellStyleNumber = {
        font: { bold: true, color: { argb: "080800" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" },
        },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };
      const fontBold = {
        font: { bold: true },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "e5e8ee" },
        },
      };
      const cellAlignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells("A1:C1");

      // Apply cell styling to the merged cell
      const mergedCell = worksheet.getCell("A1");
      mergedCell.style = cellStyleNumber;
      mergedCell.alignment = cellAlignment;

      // Set content for the merged cell
      mergedCell.value = this.header_name;

      for (let i = 0; i < table.rows.length; i++) {
        const row = worksheet.addRow([]);
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          const cell = table.rows[i].cells[j];
          const cellValue = cell.innerText;
          const excelCell = row.getCell(j + 1);
          excelCell.value = cellValue;

          if (excelCell._address == "A2" || excelCell._address == "B2" || excelCell._address == "C2"){
            excelCell.style = cellStyle;
          }

          // Calculate and set the column width based on the content length
          const cellContentLength = cellValue.length;
          const column = worksheet.getColumn(j + 1);
          const currentColumnWidth = column.width || 10;
          const newColumnWidth = Math.max(
            currentColumnWidth,
            cellContentLength + 2
          );
          column.width = newColumnWidth;
        }
      }
      let filename = this.header_name;
      // Generate the Excel file
      if (dl) {
        console.log("inside if");
        const buffer = workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        let stringWithUnderscores = filename.replace(/\s+/g, "_");
        a.download = stringWithUnderscores + ".xlsx";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.log("inside else");
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          let stringWithUnderscores = filename.replace(/\s+/g, "_");
          a.download = stringWithUnderscores + ".xlsx";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
      }
    },
}

}
</script>

<style scoped>

#downloaddummybutton {
  display: none;
}
#hiddentableexcel_format {
  display: none;
}
</style>