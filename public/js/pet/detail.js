window.onload = () => {
  // SELECTOR COLLECTION
  const selector = {
    tableTag: document.querySelector('#table-record > table'),
    btnHistory: document.getElementById('btn_history'),
    btnImmunization: document.getElementById('btn_immunization'),
    btnDeworm: document.getElementById('btn_deworm'),
    totalPages: document.getElementById('page-total'),
    pageStart: document.getElementById('page-start'),
    pageEnd: document.getElementById('page-end'),
    btnBack: document.getElementsByClassName('btn-back')[0],
    btnNext: document.getElementsByClassName('btn-next')[0],
    btnAdd: document.getElementById('btn-add'),
  };
  // Create Table Field
  const historyField = ['Bác sĩ', 'Thú cưng', 'Khách hàng', 'Thời gian', 'Chẩn đoán', 'Trạng thái'];
  const immunizationField = ['Thú cưng', 'Tuổi', 'Loại văccine', 'Đơn vị', 'Thời gian'];
  const dewormField = ['Thú cưng', 'Thời gian'];
  // DATA Type
  const DATA = {
    HISTORY: 'medicalHistories',
    IMMUNIZATAION: 'immunization',
    DEWORM: 'deworming',
  };
  const petId = location.href.split('/')[4];
  // fill value for customer form
  const { tableTag, btnHistory, btnImmunization, btnDeworm, btnBack, btnNext } = selector;
  let fieldType = historyField;
  // Initial Variable
  let index = 1;
  let dataType = DATA.HISTORY;

  const removeTable = () => {
    tableTag.innerHTML = '';
  };

  const createTableHeader = (table, fieldType) => {
    const tHead = document.createElement('thead');
    const tRow = document.createElement('tr');
    for (let headField of fieldType) {
      const cell = document.createElement('th');
      const cellText = document.createTextNode(headField);
      cell.appendChild(cellText);
      tRow.appendChild(cell);
    }
    tHead.appendChild(tRow);
    table.appendChild(tHead);
  };
  const createTableBody = (table, tableData) => {
    const tBody = document.createElement('tbody');
    tBody.innerHTML = '';
    for (let data of tableData) {
      const tRow = document.createElement('tr');
      const showData = [
        data.user.name,
        data.pet.name,
        data.pet.customer.name,
        moment(data.date).format('DD/MM/YYYY'),
        data.diagnosis,
        data.pet.status,
      ];
      for (let elm of showData) {
        const td = document.createElement('td');
        td.appendChild(document.createTextNode(elm));
        tRow.appendChild(td);
      }
      tBody.appendChild(tRow);
    }
    table.appendChild(tBody);
  };

  const getTableData = async (pageIndex, fieldType, dataType) => {
    // Enabled btn
    btnBack.disabled = false;
    btnBack.classList.remove('btn-disabled');
    btnNext.disabled = false;
    btnNext.classList.remove('btn-disabled');
    // GET DATA
    let histories;
    const { data } = await axios.get(`http://localhost:3000/${dataType}/${petId}`);
    histories = data.data;

    // valid Page
    const pageSize = 5;
    const numPages = Math.ceil(histories.length / pageSize);
    if (pageIndex < 1) pageIndex = 1;
    if (pageIndex > numPages) pageIndex = numPages;
    // select tag page number
    const totalPages = selector.totalPages;
    const pageStart = selector.pageStart;
    const pageEnd = selector.pageEnd;
    // Set up pagination
    totalPages.innerHTML = histories.length;
    pageStart.innerHTML = pageIndex * pageSize - 4 < 0 ? 0 : pageIndex * pageSize - 4;
    pageEnd.innerHTML = pageIndex * pageSize > histories.length ? histories.length : pageIndex * pageSize;
    // Set up Btn Back and Next
    if (pageIndex == 1) {
      btnBack.disabled = true;
      btnBack.classList.add('btn-disabled');
    }
    if (pageIndex == numPages) {
      btnNext.disabled = true;
      btnNext.classList.add('btn-disabled');
    }
    const dataShow = histories.filter((v, index) => index >= pageIndex * pageSize - 5 && index <= pageIndex * pageSize - 1);
    console.log('🚀 ~ file: detail.js ~ line 98 ~ getTableData ~ dataShow', dataShow);
    // render history data to html
    removeTable();
    createTableHeader(tableTag, fieldType);
    createTableBody(tableTag, dataShow);
  };

  const onHandleBtn = isNext => {
    isNext ? index++ : index--;
    getTableData(index, fieldType);
  };

  btnBack.onclick = () => onHandleBtn(false);
  btnNext.onclick = () => onHandleBtn(true);

  // Show data first Tab
  getTableData(index, fieldType, dataType);
  // Change Data Table
  btnHistory.onclick = () => {
    removeTable();
    fieldType = historyField;
    dataType = DATA.HISTORY;
    getTableData(index, fieldType, dataType);
  };
  btnImmunization.onclick = () => {
    removeTable();
    fieldType = immunizationField;
    dataType = DATA.IMMUNIZATAION;

    getTableData(index, fieldType, dataType);
  };
  btnDeworm.onclick = () => {
    removeTable();
    fieldType = dewormField;
    dataType = DATA.DEWORM;
    getTableData(index, fieldType, dataType);
  };

  selector.btnAdd.onclick = () => {
    location.href = `/${dataType}/${petId}/create`;
  };
};
