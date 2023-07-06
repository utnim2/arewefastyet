/*
Copyright 2023 The Vitess Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import { ResponsiveLine } from '@nivo/line'

import '../CRONSummary/cronSummary.css'

const CronSummary = ({data, setBenchmarktype, setIsLoading2, benchmarkType}) => {

    const transformedData = [
        {
          id: 'QPSTotal',
          data: data.Data.map((item) => ({
            x: item.CreatedAt,
            y: item.QPSTotal,
          })),
        },
      ];

      const getBenchmarkType = () => {
        if (benchmarkType.length == 0) {
            setIsLoading2(true)
        }
        setBenchmarktype(data.Name)
        
      }

    return (
        <div className='cronSummary flex--column' onClick={getBenchmarkType}>
            <div className='cronSummary__chart'>
                <ResponsiveLine
                    data={transformedData}
                    width={300}
                    height={100}
                    enableGridX={false}
                    enableGridY={false}
                    colors={['#E77002']}
                    />
            </div>
            <figure className='cronSummary__line'></figure>
            <div className='cronSummary__text'>
                <span>QPSTotal</span>
                <h3>{data.Name}</h3>
                <i className="fa-solid fa-arrow-right"></i>
            </div>
        </div>
    );
};

export default CronSummary;
