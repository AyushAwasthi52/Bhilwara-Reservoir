 import { LatLngExpression } from 'leaflet';
 
 export type ReservoirType = 'Dam' | 'Lake' | 'Check Dam';
 export type WaterStatus = 'Normal' | 'Low' | 'Critical';
 
 export interface Reservoir {
   id: string;
   name: string;
   type: ReservoirType;
   coordinates: LatLngExpression;
   area: number; // sq km
   storageCapacity: number; // million cubic meters
   averageDepth: number; // meters
   currentWaterLevel: number; // percentage
   status: WaterStatus;
   description?: string;
   yearBuilt?: number;
 }
 
 export const reservoirs: Reservoir[] = [
   {
     id: 'meja-dam',
     name: 'Meja Dam',
     type: 'Dam',
     coordinates: [25.4256, 74.5821],
     area: 12.5,
     storageCapacity: 95.2,
     averageDepth: 18.5,
     currentWaterLevel: 72,
     status: 'Normal',
     description: 'Major irrigation dam serving Bhilwara district',
     yearBuilt: 1968,
   },
   {
     id: 'khari-dam',
     name: 'Khari Dam',
     type: 'Dam',
     coordinates: [25.5123, 74.7234],
     area: 8.3,
     storageCapacity: 62.8,
     averageDepth: 14.2,
     currentWaterLevel: 45,
     status: 'Low',
     description: 'Secondary irrigation reservoir',
     yearBuilt: 1975,
   },
   {
     id: 'mandalgarh-lake',
     name: 'Mandalgarh Lake',
     type: 'Lake',
     coordinates: [25.4432, 75.0156],
     area: 3.2,
     storageCapacity: 28.5,
     averageDepth: 9.8,
     currentWaterLevel: 88,
     status: 'Normal',
     description: 'Natural lake with historical significance',
     yearBuilt: undefined,
   },
   {
     id: 'kotri-dam',
     name: 'Kotri Dam',
     type: 'Dam',
     coordinates: [25.1567, 74.8432],
     area: 15.7,
     storageCapacity: 142.3,
     averageDepth: 22.1,
     currentWaterLevel: 28,
     status: 'Critical',
     description: 'Primary water supply dam for southern Bhilwara',
     yearBuilt: 1982,
   },
   {
     id: 'sareri-check-dam',
     name: 'Sareri Check Dam',
     type: 'Check Dam',
     coordinates: [25.6234, 74.6543],
     area: 1.8,
     storageCapacity: 12.4,
     averageDepth: 6.5,
     currentWaterLevel: 65,
     status: 'Normal',
     description: 'Rainwater harvesting structure',
     yearBuilt: 2005,
   },
   {
     id: 'badnor-lake',
     name: 'Badnor Lake',
     type: 'Lake',
     coordinates: [25.3678, 74.4521],
     area: 2.4,
     storageCapacity: 18.9,
     averageDepth: 7.8,
     currentWaterLevel: 52,
     status: 'Low',
     description: 'Seasonal lake with agricultural importance',
   },
   {
     id: 'raipur-dam',
     name: 'Raipur Dam',
     type: 'Dam',
     coordinates: [25.2845, 74.9876],
     area: 6.9,
     storageCapacity: 48.2,
     averageDepth: 11.3,
     currentWaterLevel: 81,
     status: 'Normal',
     description: 'Medium irrigation project',
     yearBuilt: 1990,
   },
   {
     id: 'gangapur-check-dam',
     name: 'Gangapur Check Dam',
     type: 'Check Dam',
     coordinates: [25.5567, 74.8123],
     area: 0.9,
     storageCapacity: 5.6,
     averageDepth: 4.2,
     currentWaterLevel: 35,
     status: 'Low',
     description: 'Small water harvesting structure',
     yearBuilt: 2010,
   },
   {
     id: 'jahazpur-reservoir',
     name: 'Jahazpur Reservoir',
     type: 'Dam',
     coordinates: [25.6123, 75.1234],
     area: 4.5,
     storageCapacity: 32.7,
     averageDepth: 8.9,
     currentWaterLevel: 19,
     status: 'Critical',
     description: 'Eastern district water supply',
     yearBuilt: 1988,
   },
   {
     id: 'asind-lake',
     name: 'Asind Lake',
     type: 'Lake',
     coordinates: [25.7345, 74.3456],
     area: 5.1,
     storageCapacity: 38.4,
     averageDepth: 10.5,
     currentWaterLevel: 76,
     status: 'Normal',
     description: 'Major natural water body in northern region',
   },
 ];
 
 export const getStatistics = () => {
   const totalReservoirs = reservoirs.length;
   const totalCapacity = reservoirs.reduce((sum, r) => sum + r.storageCapacity, 0);
   const criticalCount = reservoirs.filter(r => r.status === 'Critical').length;
   const lowCount = reservoirs.filter(r => r.status === 'Low').length;
   const normalCount = reservoirs.filter(r => r.status === 'Normal').length;
   const avgWaterLevel = Math.round(reservoirs.reduce((sum, r) => sum + r.currentWaterLevel, 0) / totalReservoirs);
   
   return {
     totalReservoirs,
     totalCapacity: Math.round(totalCapacity * 10) / 10,
     criticalCount,
     lowCount,
     normalCount,
     avgWaterLevel,
   };
 };