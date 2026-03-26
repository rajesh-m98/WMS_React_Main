import { toast } from "sonner";

/**
 * Common utility to parse CSV files into JSON objects.
 */
export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) {
        toast.error("CSV appears to be empty or missing data rows");
        resolve([]);
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const jsonResult = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj: any, header, index) => {
          obj[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
          return obj;
        }, {});
      });
      
      resolve(jsonResult);
    };
    reader.onerror = () => {
      toast.error("Failed to read the file");
      reject(new Error("File read error"));
    };
    reader.readAsText(file);
  });
};

/**
 * Common utility to download JSON data as CSV file.
 */
export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    toast.error("No data available to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Headers row
  csvRows.push(headers.join(','));
  
  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + val).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
