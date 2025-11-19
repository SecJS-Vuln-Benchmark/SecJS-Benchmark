# SecJS 目录结构变更说明

## 目录重组

本目录结构是从原始项目重组而来，主要变更如下：

### 目录结构

```
SecJS/
├── ForgeJS/          # 数据集生成代码（原 dataset/ 目录）
├── JudgeJS/          # 评估代码（原 evaluation/ + models/ + utils/ + config/）
└── ArenaJS/          # 数据集目录（新建，数据需单独下载）
```

### 路径变更

#### ForgeJS 路径变更

- 数据输出目录：`data/` → `ForgeJS/data/`（保持不变，相对路径）
- 项目输出目录：`dataset/databackup/projects` → `../ArenaJS/projects`
- 增强项目输出：`dataset/databackup/augmented_projects` → `../ArenaJS/augmented_projects`
- 代码备份目录：`databackup/code_files` → `../ArenaJS/code_files`

#### JudgeJS 路径变更

- 数据集 CSV：`dataset/data/*.csv` → `../ArenaJS/data/*.csv`
- 项目目录：`dataset/databackup/projects` → `../ArenaJS/projects`
- 增强项目：`dataset/databackup/augmented_projects/*` → `../ArenaJS/augmented_projects/*`
- 配置文件：`config/config.py` → `JudgeJS/config/config.py`（相对路径已更新）

### 主要修改的文件

1. **ForgeJS/main.py**
   - 更新默认项目目录参数
   - 更新检查点目录路径

2. **ForgeJS/js_commit_info.py**
   - 更新输出目录路径指向 ArenaJS

3. **ForgeJS/js_function_extractor.py**
   - 更新备份恢复路径

4. **ForgeJS/augmentation_config.py**
   - 更新代码备份目录路径

5. **JudgeJS/config/config.py**
   - 更新所有数据集路径配置

6. **JudgeJS/project_detection.py**
   - 更新模块导入路径
   - 更新配置文件路径

7. **JudgeJS/evaluation/checkpoint_utils.py**
   - 更新项目目录默认路径
   - 更新 claude-code-security-review 模块查找逻辑

8. **JudgeJS/utils/project_loader.py**
   - 更新文档注释中的路径示例

### 新增文件

- `SecJS/README.md` - 主 README
- `SecJS/ForgeJS/README.md` - ForgeJS 使用说明
- `SecJS/JudgeJS/README.md` - JudgeJS 使用说明
- `SecJS/ArenaJS/README.md` - 数据集下载说明
- `SecJS/.gitignore` - Git 忽略文件
- `SecJS/ForgeJS/js_dataset_augmentor.py` - 数据增强占位文件

### 注意事项

1. **数据集下载**：ArenaJS 数据集需要单独下载，详见 `ArenaJS/README.md`
2. **依赖模块**：`claude-code-security-review` 已复制到 `JudgeJS/` 目录
3. **路径引用**：所有路径引用已更新为相对路径，适应新目录结构
4. **冗余文件**：已清理临时文件、缓存文件和测试结果文件

### 使用前准备

1. 下载 ArenaJS 数据集到 `SecJS/ArenaJS/` 目录
2. 安装 Python 依赖（见各组件 README）
3. 配置 LLM API 密钥（见 `JudgeJS/config/config.py` 或 `model_endpoints.json`）


