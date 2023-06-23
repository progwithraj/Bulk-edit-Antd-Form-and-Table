import { useState, useEffect } from "react";
import { Form, Table, Input, Button, Space, Checkbox } from "antd";

export const YourComponent = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([
    { id: 1, name: "John", age: 25 },
    { id: 2, name: "Jane", age: 30 },
    { id: 3, name: "Bob", age: 40 },
  ]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkEditEnabled, setBulkEditEnabled] = useState(false);

  useEffect(() => {
    selectedRowKeys.length && setBulkEditEnabled(true);
  }, [selectedRowKeys]);
  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log("Form values:", values);
      // Perform any necessary actions with the form data
      // For example, update the table data state
      const updatedData = tableData.map((record) => {
        if (selectedRowKeys.includes(record.id)) {
          return {
            ...record,
            ...values.tableData[record.id],
          };
        }
        return record;
      });
      setTableData(updatedData);
      setSelectedRowKeys([]); // Clear selected rows
      setBulkEditEnabled(false); // Disable bulk edit mode
    });
  };

  const handleBulkEditToggle = (e) => {
    setBulkEditEnabled(e.target.checked);
    setSelectedRowKeys([]);
  };

  const handleRowSelect = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    form.resetFields();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelect,
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <Form.Item name={["tableData", record.id, "name"]} initialValue={text}>
          <Input disabled={!bulkEditEnabled} />
        </Form.Item>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      render: (text, record) => (
        <Form.Item name={["tableData", record.id, "age"]} initialValue={text}>
          <Input disabled={!bulkEditEnabled} />
        </Form.Item>
      ),
    },
  ];

  return (
    <Form form={form}>
      <Space style={{ marginBottom: 16 }}>
        <Checkbox checked={bulkEditEnabled} onChange={handleBulkEditToggle}>
          Bulk Edit
        </Checkbox>
        <Button
          type="primary"
          onClick={handleSave}
          disabled={!selectedRowKeys.length || !bulkEditEnabled}
        >
          Save
        </Button>
      </Space>

      <Table
        dataSource={tableData}
        columns={columns}
        rowKey="id"
        pagination={false}
        rowSelection={rowSelection}
      />
    </Form>
  );
};

export default YourComponent;
