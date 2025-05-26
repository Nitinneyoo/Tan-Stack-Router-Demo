import { createFileRoute, Link } from '@tanstack/react-router'
import mData from "../../MOCK_DATA.json"
import React, { useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { Table, TableBody, TableCaption, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface DataItem {
  id: number;
  "Robot Name": string;
  "Robot ID": string;
  ip_address: string;
  Path: string;
  [key: string]: string | number;
}

const TableData = () => {
  const [filterType, setFilterType] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const data = useMemo(() => {
    if (!filterType || !filterValue) return mData
    return mData.filter(item => 
      String((item as DataItem)[filterType]).toLowerCase().includes(filterValue.toLowerCase())
    )
  }, [filterType, filterValue])

  const columns = React.useMemo(
    () => [
      { 
        header: 'ID',
        accessorKey: 'id',
        footer: 'ID'
      },
      {
        header: 'RobotName',
        accessorKey: 'Robot Name',
        footer: 'RobotName',
      },
      {
        header: 'RobotID',
        accessorKey: 'Robot ID',
        footer: 'RobotID',
      },
      {
        header: 'IP_Address',
        accessorKey: 'ip_address',
        footer: 'IP_Address',
      },
      {
        header: 'PATH',
        accessorKey: 'Path',
        footer: 'PATH',
      },
    ],
    []
  )

  const table = useReactTable({
    data, 
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleFilterApply = () => {
    setIsPopoverOpen(false)
  }

  return (
    <div>
      <header className="p-2 bg-gray-200 flex items-center justify-between text-xl font-bold shadow-lg">
        <Link to="/Fleet" className="text-gray-900">
          Fleet
        </Link>
        <div className="text-sm font-normal">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="text-gray-900 hover:bg-blue-600 cursor-pointer border-2 !border-gray-400"
              >
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <h3 className="font-medium">Filter Options</h3>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">Select Filter</option>
                  <option value="Robot Name">Robot Name</option>
                  <option value="Robot ID">Robot ID</option>
                  <option value="ip_address">IP Address</option>
                </select>
                <Input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Enter filter value"
                />
                <Button onClick={handleFilterApply}>Apply</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      <Table className='text-gray-700 border-collapse border border-gray-300 w-full'>
        <TableCaption>A list of your Robot Details.</TableCaption>
        <TableHeader className='text-bold text-xl font-serif'>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableHead key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          {table.getFooterGroups().map(footerGroup => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.footer, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableFooter>
      </Table>
    </div>
  )
}

export const Route = createFileRoute('/table/')({
  component: TableData,
})

export default TableData;