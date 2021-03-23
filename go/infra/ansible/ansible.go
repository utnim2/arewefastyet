/*
 *
 * Copyright 2021 The Vitess Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * /
 */

package ansible

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"io/ioutil"
	"path"
	"strings"
)

const (
	flagAnsibleRoot    = "ansible-root-directory"
	flagInventoryFiles = "ansible-inventory-files"
	flagPlaybookFiles  = "ansible-playbook-files"

	tokenDeviceIP = "DEVICE_IP"
)

type Config struct {
	RootDir string
	InventoryFiles []string
	PlaybookFiles  []string
}

func (c *Config) AddToPersistentCommand(cmd *cobra.Command) {
	cmd.PersistentFlags().StringVar(&c.RootDir, flagAnsibleRoot, "", "Root directory of Ansible")
	cmd.PersistentFlags().StringSliceVar(&c.InventoryFiles, flagInventoryFiles, []string{}, "List of inventory files used by Ansible")
	cmd.PersistentFlags().StringSliceVar(&c.PlaybookFiles, flagPlaybookFiles, []string{}, "List of playbook files used by Ansible")

	viper.BindPFlag(flagAnsibleRoot, cmd.Flags().Lookup(flagAnsibleRoot))
	viper.BindPFlag(flagInventoryFiles, cmd.Flags().Lookup(flagInventoryFiles))
	viper.BindPFlag(flagPlaybookFiles, cmd.Flags().Lookup(flagPlaybookFiles))
}

func addIPsToFile(IPs []string, file, root string) error {
	if path.IsAbs(file) == false {
		file = path.Join(root, file)
	}
	content, err := ioutil.ReadFile(file)
	if err != nil {
		return err
	}
	var newContent string
	for i, IP := range IPs {
		newContent = strings.Replace(string(content), fmt.Sprintf("%s_%d", tokenDeviceIP, i), IP, -1)
	}
	err = ioutil.WriteFile(file, []byte(newContent), 0)
	if err != nil {
		return err
	}
	return nil
}

func addIPsToFileSlice(IPs, files []string, root string) error {
	for _, file := range files {
		err := addIPsToFile(IPs, file, root)
		if err != nil {
			return err
		}
	}
	return nil
}

func AddIPsToFiles(IPs []string, c Config) error {
	err := addIPsToFileSlice(IPs, c.PlaybookFiles, c.RootDir)
	if err != nil {
		return err
	}

	err = addIPsToFileSlice(IPs, c.InventoryFiles, c.RootDir)
	if err != nil {
		return err
	}
	return nil
}